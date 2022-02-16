const kind = function(item) {
    let getPrototype = function(item) {
        return Object.prototype.toString.call(item).slice(8, -1);
    };
    let kind, Undefined;
    if (item === null ) {
        kind = 'null';
    } else {
        if ( item === Undefined ) {
            kind = 'undefined';
        } else {
            let prototype = getPrototype(item);
            if ( ( prototype === 'Number' ) && isNaN(item) ) {
                kind = 'NaN';
            } else {
                kind = prototype;
            }
        }
    }
    return kind;
};

export {kind}