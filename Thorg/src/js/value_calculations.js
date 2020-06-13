/* ===== PARAMETERS ==========
destination = the name of the attribute that stores the total quantity
section = name of repeating fieldset, without the repeating_
fields = the name of the attribute field to be summed
      can be a single attribute: 'weight'
      or an array of attributes: ['weight','number','equipped']
multiplier (optional) = a multiplier to the entire fieldset total. For instance, if summing coins of weight 0.02, might want to multiply the final total by 0.02.
*/
const repeatingSum = (destination, section, fields, multiplier = 1) => {
    if (!Array.isArray(fields)) fields = [fields];
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce( (m,id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${section}${field}`))],[]);
        getAttrs(attrArray, v => {
            console.log("===== values of v: "+ JSON.stringify(v) +" =====");
                 // getValue: if not a number, returns 1 if it is 'on' (checkbox), otherwise returns 0..
            const getValue = (section, id,field) => parseFloat(v[`repeating_${section}_${id}_${section}${field}`]) || (v[`repeating_${section}_${id}_${section}${field}`] == "on" ? 1 : 0); 
            const sumTotal = idArray.reduce((total, id) => total + fields.reduce((subtotal,field) => subtotal * getValue(section, id,field),1),0);
            setAttrs({[destination]: sumTotal * multiplier});    
        });
    });
};

function finalizeBonis(bonus, numberOnly) {
    if (numberOnly){
        return bonus
    }
    var bonusAsList = bonus.split("\n");
    var mainMod=parseFloat(bonusAsList[0]);
    var result=mainMod;
    if (result>0) {
        result='+'+result;                    
    }
    result=[result];
    bonusAsList.shift();
    bonusAsList.forEach((element) => {
        var type1 = element.split(':')[1];
        var sum=parseFloat(element)+mainMod;
        if (sum>0) {
            sum='+'+sum;                    
        }
        result.push(element.replace(/-?\+?\d+/,sum));
    });
    return result.join('\n');
}
function fuse2Bonis(bonus1, bonus2, numberOnly) {
    var bonus1AsList = bonus1.split("\n");
    var bonus2AsList = bonus2.split("\n");

    var result=parseFloat(bonus1AsList[0])+parseFloat(bonus2AsList[0]);
    if (result>0) {
        result='+'+result;                    
    }
    if (numberOnly) {
        return result
    }
    result=[result];
    bonus1AsList.shift();
    bonus2AsList.shift();
    bonus1AsList.forEach((element1,index) => {
        var type1 = element.split(':')[1];
        bonus2AsList.forEach((element2,index) => {
            var type2 = element2.split(':')[1];
            if (type1==type2){
                var sum=parseFloat(element1)+parseFloat(element2);
                if (sum>0) {
                    sum='+'+sum;                    
                }
                element1=element1.replace(/-?\+?\d+/,sum);
                bonus2AsList.splice(index,1);
            }
        });
        result.push(element1);
    });
    return result.concat(bonus2AsList).join('\n');
}

const repeatingSumBoni = (destination, section, attributeName, field, numberOnly, disblerField=0) => {
    fields = [nameingField,field];
    if (disblerField){
        fields.push(disblerField)
    }
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce( (m,id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${section}${field}`))],[]);
        getAttrs(attrArray, v => {
            const reduceFn = (result, id) => {
                if ((v[`repeating_${section}_${id}_${nameingField}`]==attributeName)&&
                    ((!disblerField)||(v[`repeating_${section}_${id}_${section}${disblerField}`]))){
                        return fuse2Bonis(result, v[`repeating_${section}_${id}_${section}${field}`],numberOnly);
                } else {
                    return result                    
                }
            }
            const finalResult = idArray.reduce(reduceFn,"0");
            setAttrs({[destination]: sumTotal * multiplier});    
        });
    });
};

const calcLevelUp = (attribute) => {
    repeatingSumBoni(attribute+levelUp, levelUpSection, attribute, levelUpValue, 1);
};
const calcRealValue = (attribute) => {
    fields = [attribute+baseValue,attribute+levelUp];
    getAttrs(fields, function(values) {
        setAttrs({
            [attribute+value]: parseFloat(values[fields[0]])+ parseFloat(values[fields[1]])
        });
    });
};
const calcModAutoValue = (attribute, numberOnly=0) => {
    repeatingSumBoni(attribute+modAuto, boniSection, attribute, boniValue, numberOnly, boniActive);
};
const calcFullModValue = (attribute, numberOnly=0) => {
    fields = [attribute+modAuto,attribute+modManuel];
    getAttrs(fields, function(values) {
        setAttrs({
            [attribute+mod]: finalizeBonis(fuse2Bonis(values[fields[0]], values[fields[1]], numberOnly), numberOnly)
        });
    });
};
const calcFullValue = (attribute, numberOnly=1) => {
    fields = [attribute+mod,attribute+value];
    getAttrs(fields, function(values) {
        setAttrs({
            [attribute+final]: fuse2Bonis(values[fields[0]], values[fields[1]], numberOnly)
        });
    });
};
//Operatoren: +,-,*,/,max,min,>,<
const evalOneOperation = (first, second, operation) => {
    switch (operation) {
        case "+":
            return first+second;
        case "-":
            return first-second;
        case "*":
            return first*second;
        case "/":
            return first/second;
        case "min":
            return Math.min(first,second);
        case "max":
            return Math.max(first,second);
        case "<":
            return first<second?1:0;
        case ">":
            return first>second?1:0;
    }
};
// operation: =;ciel(c);floor(f);round(r)
const evalUnaryOperation = (first, operation, addition) => {
    switch (operation) {
        case "c":
            var result=Math.round(first);
            break;
        case "f":
            var result=Math.floor(first);
            break;
        case "r":
            var result=Math.ceil(first);
            break;
        case "=":
            var result=first;
            break;
                            
        default:
            var result="0\n"+first+":d"+operation;
            addition=0;
            break;
    }
    if (addition){
        result="0\n"+result+":"+addition;
    }
    return result;
};
const evalBonusText = (destination,text,active,changeingValue) => {
    var attributes = text.match(/{[^}]*}/g);
    const attrArray = attributes.reduce((m,id) => [...m, ...(id.substring(1,id.length-1))],[]);
    getAttrs(attrArray, v => {
        var operations = text.split(';');
        var addition = operations.pop();
        var unaryOperand = operations.pop();
        var i=0;
        var preValue=0;
        var roll=0;
    
        firstValue=parseFloat(operations[0]);
        operations.shift();
        if (!firstValue){
            firstValue=parseFloat(v[attrArray[i]]);
            i++;
        }
        while (length(operations)) {
            secondValue=parseFloat(operations[0]);
            operations.shift();
            if (!secondValue) {
                secondValue=parseFloat(v[attrArray[i]]);
                i++;
            }
            var operation=operations[0];
            operations.shift()     
            if (operation=="w") {
                preValue=firstValue;
                firstValue=secondValue;
                roll+=1;
            } else {
                firstValue=evalOneOperation(firstValue,secondValue,operation)
            }
        }
        if ((roll==1) && preValue) {
            setAttrs({[destination]: evalUnaryOperation(preValue,firstValue,preValue,addition)}, "silent", () => calcModAutoValue(changeingValue));    
        } else if (!roll) {
            setAttrs({[destination]: evalUnaryOperation(preValue,firstValue,unaryOperand,addition)}, "silent", () => calcModAutoValue(changeingValue));    
        }
    });
};
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
const getAttributesWithChangedBoni = (originalText,newText="") => {
    var attributes = originalText.match(/{[^}]*}/g);
    attributes.concat(newText.match(/{[^}]*}/g))
    return attributes.filter( onlyUnique ).map((v) => v.substring(1,id.length-1));
};
