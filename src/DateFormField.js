/**
 * DateFormField Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

let FormField = require('uxcore-form-field');
let Constants = require('uxcore-const');
let classnames = require('classnames');
let Calendar = require('uxcore-calendar');
let assign = require('object-assign');
let deepcopy = require('deepcopy');
let Formatter = require('uxcore-formatter');

class DateFormField extends FormField {
    constructor(props) {
        super(props);
    }

    handleChange(value) {
        let me = this;
        me.handleDataChange(new Date(value).getTime());
    }

    handleCascadeChange(i, value) {
        let me = this;
        let values = deepcopy(me.state.value) || [];
        values[i] = new Date(value).getTime();
        if (i == 0 && !!values[1] && new Date(value).getTime() > new Date(values[1]).getTime()) {
            values.pop();
        }
        if (i == 1 && !!values[0] && new Date(value).getTime() < new Date(values[0]).getTime()) {
            values[0] = undefined;
        }
        me.handleDataChange(values);
    }

    addSpecificClass() {
        let me = this;
        if (me.props.jsxprefixCls == "kuma-uxform-field") {
            let str = me.props.jsxprefixCls + " kuma-date-uxform-field" ;
            if (me.props.jsxtype == "cascade") {
                str += " kuma-cascade-date-uxform-field"
            }
            return str;
        }
        else {
            return me.props.jsxprefixCls
        }
    }

    processTime(time) {
        // if showTime is true or timePicker is set, we use time to compare
        // otherwise we use day to compare
        let me = this;
        let {showTime, timePicker} = me.props;
        if (showTime || timePicker) {
            return new Date(time).getTime();
        }
        else {
            return new Date(Formatter.date(time, 'YYYY-MM-DD')).getTime();
        }
    }

    renderField() {
        let me = this;
        let {onSelect, style, prefixCls, value, jsxtype, jsxfrom, jsxto, disabledDate, ...others} = me.props;
        let from = !!jsxfrom ? me.processTime(jsxfrom) : 0;
        let to = !!jsxto ? me.processTime(jsxto) : Infinity;
        let mode = me.props.jsxmode || me.props.mode;
        if (mode == Constants.MODE.EDIT) {
            if (jsxtype == "single") {
                return <Calendar
                        value={me.state.value}
                        onSelect={me.handleChange.bind(me)}
                        disabledDate={disabledDate ? disabledDate : (current, value) => {
                            // if showTime is true or timePicker is set, we use time to compare
                            // otherwise we use day to compare

                            return (me.processTime(current.getTime()) < from || me.processTime(current.getTime()) > to)
                        }}
                        {...others}/>
            }
            else if (jsxtype == "cascade") {
                let arr = [];
                let others1 = assign({}, others);
                let others2 = assign({}, others);
                if (me.state.value && me.state.value[0]) {
                    others1 = assign({}, others, {
                        value: me.state.value[0]
                    });
                }
                else {
                    others1 = assign({}, others, {
                        value: null
                    });
                }
                if (me.state.value && me.state.value[1]) {
                    others2 = assign({}, others, {
                        value: me.state.value[1]
                    });
                }
                else {
                    others2 = assign({}, others, {
                        value: null
                    });
                }
                arr.push(<Calendar
                        key="calendar1"
                        onSelect={me.handleCascadeChange.bind(me, 0)}
                        disabledDate={(current, value) => {
                            let now = me.processTime(current.getTime());
                            return (now < from || now > to)
                        }}
                        {...others1}/>);
                arr.push(<span key="split" className="kuma-uxform-split">-</span>)

                arr.push(<Calendar
                        key="calendar2"
                        onSelect={me.handleCascadeChange.bind(me, 1)}
                        disabledDate={(current, value) => {
                            let now = me.processTime(current.getTime());
                            let first = me.state.value ? me.state.value[0] : 0;
                            first = me.processTime(first);
                            return (now < from || now > to || now < first);
                        }}
                        {...others2}/>);
                return arr;
            }
        }
        else if (mode == Constants.MODE.VIEW) {
            let defautFormat = 'YYYY-MM-DD';
            if (me.props.showTime || me.props.timePicker) {
                defautFormat = 'YYYY-MM-DD HH:mm:ss';
            }
            if (jsxtype == "single") {
                return <span>{!!me.state.value ? Formatter.date(me.state.value, (me.props.format || defautFormat)) : ""}</span>
            }
            else {
                return <span>{!!me.state.value ? me.state.value.map((item) => {
                    return Formatter.date(item, (me.props.format || defautFormat))
                }).join(" - ") : ""}</span>
            }
        }
    }
}

DateFormField.displayName = "DateFormField";
DateFormField.propTypes = assign(FormField.propTypes, {
    jsxtype: React.PropTypes.string,
});
DateFormField.defaultProps = assign(FormField.defaultProps, {
    locale: 'zh-cn',
    hasTrigger: true,
    jsxtype: "single"
});
module.exports = DateFormField;
