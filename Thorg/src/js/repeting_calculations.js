
//html
//<div class="spell_tabs">
//    <input type="radio" name="attr_spell_tabs" value="-1">
//    <input type="radio" name="attr_spell_tabs" value="0">
//    <input type="radio" name="attr_spell_tabs" value="1">
//    <input type="radio" name="attr_spell_tabs" value="2">
//    <input type="radio" name="attr_spell_tabs" value="3">
//    <input type="radio" name="attr_spell_tabs" value="4">
//    <input type="radio" name="attr_spell_tabs" value="5">
//</div>
//<fieldset class="repeating_spells">
//    <input type="hidden" class="toggle-show" name="attr_spell_show" value="1">
//    <div class="spell-display">
//        <label>Level <span name="attr_spell_level"></span></label>
//        <select name="attr_spell_level">
//            <option selected>-1</option>
//            <option>0</option>
//            <option>1</option>
//            <option>2</option>
//            <option>3</option>
//            <option>4</option>
//            <option>5</option>
//        </select>
//    </div>
//</fieldset>
//without section(fix tallents, option for tables)
//<input type="hidden" class="toggle-show" name="attr_[name]_show" value="1">
//<div class="spell-display">
//    normal Stuff
//</div>
//css

//div.sheet-spell-display {
//    display:none;
//}
//input.sheet-toggle-show[value="1"] ~ div.sheet-spell-display {
//    display: inline-block;
//}
//v2
on('change:spell_tabs change:class_tabs', () => {
    getSectionIDs('repeating_spells', idarray => {
        const fieldnames = [];
        idarray.forEach(id => {
            fieldnames.push(`repeating_spells_${id}_spell_level`);
            fieldnames.push(`repeating_spells_${id}_spell_class`);
        });
        getAttrs(['spell_tabs', 'spell_class', ...fieldnames], v => {
            const output = {};
            const level = +v.spell_tabs||0;
            const spellclass = +class_tabs ||0;
            idarray.forEach(id => {
                const thislevel = +v[`repeating_spells_${id}_spell_level`] || 0;
                const thisclass = +v[`repeating_spells_${id}_spell_class`] || 0;
                output[`repeating_spells_${id}_spell_show`] = (level === -1 || level === thislevel) && (spellclass === -1 || spellclass === thisclass) ? 1 : 0;
            });
            setAttrs(output);
        });
    });
});