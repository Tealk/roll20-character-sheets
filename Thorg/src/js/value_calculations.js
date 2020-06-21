const getRepSectionFieldString = (section, id,field) => `repeating_${section}_${id}_${section}${field}`; 
/* ===== PARAMETERS ==========
section = name of repeating fieldset, without the repeating_
fields = the name of the attribute field to be summed
      can be a single attribute: 'weight'
      or an array of attributes: ['weight','number','equipped']
evaluateFn = a function that takes an array of objects(v[rep.Section lines]{id: lineid, fields:fieldsvalue}) and evaluates the rep section fields.
*/
const getSectionFields = (section, fields, evaluateFn) => {
    if (!Array.isArray(fields)) fields = [fields];
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce( (m,id) => [...m, ...(fields.map(field => getRepSectionFieldString(section,id,field)))],[]);
        getAttrs(attrArray, v => {
            const getArrayValue = id => {
                var result={"id":id};
                for (field of fields){
                    result[field]=getRepSectionFieldString(section,id,field);
                }
                return result;
            }; 
            const allValues = idArray.map(getArrayValue);
            evaluateFn(allValues);
        });
    });
};
const filterNames = (allValues, nameField, searchedName) => {
    const filterFn = (value) => value[nameField]==searchedName;
    return allValues.filter(filterFn);
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

const calcLevelUp = (attributes) => {
    if (!Array.isArray(attributes)) attributes = [attributes];
    getSectionFields(levelUpSection, [nameingField, levelUpValue], (allValues) => {
        var result = {};
        for (attribute of attributes) {
            result[attribute+levelUp] = filterNames(allValues, nameingField, attribute).reduce((total, values) => total + parseFloat(values[levelUpValue]),0);
        }
        setAttrs(result);
    });
};

const calcModAutoValue = (attributes, numberOnly=0) => {
    if (!Array.isArray(attributes)) attributes = [attributes];
    getSectionFields(boniSection, [nameingField, boniValue, boniActive], (allValues) => {
        var result = {};
        for (attribute of attributes) {
            const filterFn = (value) => (value[nameingField]==attribute && value[boniActive]);
            const filteredValues = allValues.filter(filterFn);
            result[attribute+modAuto] = filteredValues.reduce((total, values) => fuse2Bonis(total, values[boniValue],numberOnly));
        }
        setAttrs(result);
    });
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

const calcEquip = () => {
    const test = [EquipSummarySum,EquipSummaryLevel,EquipSummaryMalus]
    //const level siehe bonstabelle
    //EquipSummarySum = waffen+Rüstung+anderes mit aktiv(außer Rüstung) oder am Körper
    //EquipSummaryMalus = Lastenstufe-Tragkraftstufe-3 in [0,5,10,25,50,99999]
};
const calcExp = () => {
    getSectionFields(expSection, [expNumber, expBase, expResult], (allValuesAuto) => {
        //var result = {};
        //result[getRepSectionFieldString(expSection,ID,expResult)] = allValuesAuto.reduce((total, values) => total + parseFloat(values[1]),0);
        const expsTallent = [120, 120+60, 30];
        const expsMagic = [250, 250+150, 50];
        const getAutoExp = (number, exps) => (number>=7)?exps[1]+5*exps[2]:(number>=2)?exps[1]+exps[2]*(number-2):(number==1)?exps[0]:0;
        //TODO: value check of expBase
        var autoExpSums = 0;
        var result = {};
        for (values of allValuesAuto) {
            var current = getAutoExp(parseFloat(values[expNumber]),values[expBase]?expsTallent:expsMagic);
            autoExpSums += current;
            result[getRepSectionFieldString(expSection, values.id, expResult)] = current;
        }
        getSectionFields(userExpSection, [expResult], (allValuesManuell) => {
            const manuelExpSum = allValuesManuell.reduce((total, values) => total + parseFloat(values[expResult]),0);
            result[ExpSummarySum] = manuelExpSum+autoExpSum;
            getSectionFields(levelUpSection, [EPKosten], (allValuesLevelUp) => {
                result[ExpSummaryInvested] = allValuesLevelUp.reduce((total, values) => total + parseFloat(values[EPKosten]),0);
                result[ExpSummaryOpen] = result[ExpSummarySum] - result[ExpSummaryInvested];
                setAttrs(result);
            });
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
    var valid=false;
    switch (operation) {
        case "c":
            var result=Math.round(first);
            valid=true;
            break;
        case "f":
            var result=Math.floor(first);
            valid=true;
            break;
        case "r":
            var result=Math.ceil(first);
            valid=true;
            break;
        case "=":
            var result=first;
            valid=true;
            break;
                            
        default:
            var result="0\n"+first+":d"+operation;
            addition="";
            break;
    }
    if (addition!=""){
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
                operations=operation.split(',')
                firstValue=evalOneOperation(firstValue,secondValue,operations[0])
                if (operations[1]){
                    firstValue=evalUnaryOperation(firstValue,operations[1],"")
                }
            }
        }
        if ((roll==1) && preValue) {
            setAttrs({[destination]: evalUnaryOperation(firstValue,preValue,addition)}, "silent", () => calcModAutoValue(changeingValue));    
        } else if (!roll) {
            setAttrs({[destination]: evalUnaryOperation(firstValue,unaryOperand,addition)}, "silent", () => calcModAutoValue(changeingValue));    
        }
    });
};

const calculateChangesForAttribute = (changedAttribute) => {
    getSectionFields(boniSection, [nameingField, boniActive, boniText], (allValues) => {
        const filterFn = (value) => (value[boniText].search("{"+changedAttribute+"}") != -1);
        var filtered = allValues.filter(filterFn);
        for (v of filtered){
            evalBonusText(getRepSectionFieldString(boniSection, v.id, boniValue), value[boniText], value[boniActive], value[nameingField]);
        }
    });
};

