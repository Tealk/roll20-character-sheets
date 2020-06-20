add1234To7.forEach(function (stat) {
    on("change:" + stat+fieldCodeAdditions[0]+" change:"+stat+fieldCodeAdditions[1]+" change:"+stat+fieldCodeAdditions[2]+" change:"+stat+fieldCodeAdditions[3] , () => {
        var sumFields = [stat+fieldCodeAdditions[0],stat+fieldCodeAdditions[1],stat+fieldCodeAdditions[2],stat+fieldCodeAdditions[3]];
        var allFields = sumFields;
        getAttrs(allFields, function(values) {
            setAttrs({
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+values[field])
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
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+values[field])*values[stat+fieldCodeAdditions[4]]
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
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+values[field])
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
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+values[field])
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
                [stat+fieldCodeAdditions[6]]: finalizeBonis(sumFields.reduce((total, field) => fuse2Bonis(total, values[field], 1)),1)
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
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+values[field])*values[stat+fieldCodeAdditions[4]]
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
                [stat+fieldCodeAdditions[6]]: sumFields.reduce((total, field) => total+values[field])
            });
        });
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
    fields = ["repeating_"+levelUpSection+nameingField,
              "repeating_"+levelUpSection+boniActive,
              "repeating_"+levelUpSection+boniText];
    getAttrs(fields, function(values) {
        evalBonusText("repeating_"+levelUpSection+boniValue,values[fields[2]],values[fields[1]],values[fields[0]])
    });
});

//valuesForModding.forEach(function (stat) {
//    on("change:" + stat+value+" change:"+stat+final , () => {
//        //check if stat is in a bonus event
//    });
//});
