function getRow(eventInfo,sectionname) { 
    var res = eventInfo.sourceAttribute.split("_")
    res.pop()
    res=res.join("_");
    return res+sectionname;
}



valuesLevelUpFields.forEach(function (stat) {
    on("change:" + stat+baseValue+" change:"+stat+levelUp , () => calcRealValue(stat));
});

on("change:"+levelUpSection + " remove:"+levelUpSection, (eventInfo) => {
    fields = [getRow(eventInfo.sourceAttribute,levelUpSection)+nameingField];
    getAttrs(fields, function(values) {
        calcLevelUp(values[fields[0]]);
        //todo exp summup
    });
});

on("change:"+boniSection + " remove:"+boniSection, (eventInfo) => {
    var rowId=getRow(eventInfo.sourceAttribute,boniSection);
    fields = [rowId+nameingField,
        rowId+boniActive,
        rowId+boniText];
    getAttrs(fields, function(values) {
        evalBonusText(rowId+boniValue,values[fields[2]],values[fields[1]],values[fields[0]])
    });
});

valuesWithAllBonusAndSumupValueNonNumberBonus.forEach(function (stat) {
    on("change:" + stat+modAuto+" change:"+stat+modManuel , () => calcFullModValue(stat,0));
    on("change:" + stat+mod+" change:"+stat+value , () => calcFullValue(stat,0));
});
valuesWithAllBonusAndSumupValueNumberBonus.forEach(function (stat) {
    on("change:" + stat+modAuto+" change:"+stat+modManuel , () => calcFullModValue(stat,1));
    on("change:" + stat+mod+" change:"+stat+value , () => calcFullValue(stat,1));
});
valuesForModding.forEach(function (stat) {
    on("change:" + stat+value+" change:"+stat+final , () => {
        //check if stat is in a bonus event
    });
});
