add12To7And34To8m.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[1]+" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[1]];
        var boniFields = [stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields.concat(boniFields);
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0),
                [stat+fieldCodeAdditions[7]]: finalizeBonis(boniFields.reduce((total, field) => fuse2Bonis(total, values[field], 0)),0)
            });
        });
    });
});
add12To7And34To8m.forEach(function (stat) {
    on(" change:"+stat+fieldCodeAdditions[10] , () => {
        var sumFields = [stat+fieldCodeAdditions[10],Combobox];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+show]: values[fields[0]]==Combobox
            });
        });
    });
});
on("change:" + Combobox , () => {
    var sumFields = add12To7And34To8m.map((value)=>value+fieldCodeAdditions[10]);
    var allFields = sumFields;
    getAttrs(allFields, function(values) {
        setAttrs({
            [stat+show]: values[fields[0]]==Combobox
        });
    });
});
add1234To7.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[1]+" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[1],stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0)
            });
        });
    });
});
add134Times5To7.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3]+" change:"+stat+fieldCodeAdditions[4] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields.concat([stat+fieldCodeAdditions[4]]);
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0)*values[stat+fieldCodeAdditions[4]]
            });
        });
    });
});
add134To7.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0)
            });
        });
    });
});
add14To7.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[3]];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0)
            });
        });
    });
});
add14To7m.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[3]];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: finalizeBonis(sumFields.reduce((total, field) => fuse2Bonis(total, values[field], 0)),0)
            });
        });
    });
});
add34Times5To7.forEach(function (stat) {
    on(" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3]+" change:"+stat+fieldCodeAdditions[4] , () => {
        var sumFields = [stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields.concat([stat+fieldCodeAdditions[4]]);
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0)*values[stat+fieldCodeAdditions[4]]
            });
        });
    });
});
add34To7.forEach(function (stat) {
    on(" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+parseFloat(values[field]),0)
            });
        });
    });
});

on("sheet:compendium-drop", function() {
    fields = ["infravision"+max];
    getAttrs(fields, function(values) {
        var default_attr = {};
        default_attr["bar3_link"] = "sheetattr_hp";
        default_attr["bar2_link"] = "sheetattr_essenz";
        default_attr["bar1_link"] = "sheetattr_ausdauer";
        //default_attr["bar1_value"] = 10;
        //default_attr["bar1_max"] = 15;
        default_attr["light_dimradius"] = values["infravision"+max];
        default_attr["light_radius"] = parseFloat(values["infravision"+max])+1;
        default_attr["light_losangle"] = 150;
        setDefaultToken(default_attr);
    });
});

on("change:repeating_"+levelUpSection + " remove:repeating_"+levelUpSection, () => {
    fields = ["repeating_"+levelUpSection+nameingField];
    getAttrs(fields, function(values) {
        calcLevelUp(values[fields[0]]);
        //todo exp summup
    });
});

on("change:repeating_"+boniSection + " remove:repeating_"+boniSection, () => {
    fields = ["repeating_"+boniSection+nameingField,
              "repeating_"+boniSection+boniActive,
              "repeating_"+boniSection+boniText];
    getAttrs(fields, function(values) {
        evalBonusText("repeating_"+boniSection+boniValue,values[fields[2]],values[fields[1]],values[fields[0]])
    });
});
bonusRows.forEach(function (stat) {
    on("change:"+stat + boniActive, () => {
        fields = [stat + nameingField];
        getAttrs(fields, function(values) {
            calcModAutoValue(values[fields[0]])
        });
    });
});
usingButtons.forEach(function (stat) {
    on("clicked:"+stat + usingButtonAddition, () => {
        addToRepItem(expSection, nameingField, expNumber, stat, 1)
    });
});

on('change:'+filterTalentType+' change:'+filterTalentName, () => {
    var attrArray = add12To7And34To8m.map(talent => talent+talenttype);
    attrArray.push(filterTalentType);
    attrArray.push(filterTalentName);
    getAttrs(attrArray, v => {
        //getSectionFields(EigeneTalente, add12To7And34To8m, [nameingField, boniValue, boniActive], (allValues) => {
        var result = {};
        for (talent of add12To7And34To8m) {
            result[`${talent}${show}`] = (talent.search(v[filterTalentName]) != -1 && ( v[filterTalentType]==0 || v[filterTalentType]==v[talent+talenttype] )) ? 1 : 0;
        }
        setAttrs(result);
    });
});

//valuesForModding.forEach(function (stat) {
//    on("change:" + stat+value+" change:"+stat+final , () => {
//        calculateChangesForAttribute(stat);
//    });
//});

buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        setAttrs({
            sheetTab: button
        });
    });
});