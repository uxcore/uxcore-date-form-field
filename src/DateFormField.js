/**
 * DateFormField Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const FormField = require('uxcore-form-field');
const Constants = require('uxcore-const');
const classnames = require('classnames');
const Calendar = require('uxcore-calendar');
const assign = require('object-assign');
const deepcopy = require('deepcopy');
const Formatter = require('uxcore-formatter');
const CalendarPanel = {
    month: Calendar.MonthCalendar,
    year: Calendar.YearCalendar,
    day: Calendar,
}

class DateFormField extends FormField {
    constructor(props) {
        super(props);
    }

    handleChange(value, format) {
        const me = this;
        const { useFormat } = me.props;
        let data;
        if (useFormat) {
            data = format;
        }
        else {
            data = value ? new Date(value).getTime() : null;
        }
        me.handleDataChange(data);
    }

    handleCascadeChange(i, value, format) {
        const me = this;
        let values = deepcopy(me.state.value) || [];
        const { useFormat } = me.props;
        let data;
        if (useFormat) {
           data = format; 
        }
        else {
            data = value ? new Date(value).getTime() : undefined;
        }
        values[i] = data;
        if (value) {
            if (i == 0 && !!values[1] && new Date(value).getTime() > new Date(values[1]).getTime()) {
                values.pop();
            }
            if (i == 1 && !!values[0] && new Date(value).getTime() < new Date(values[0]).getTime()) {
                values[0] = undefined;
            }
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
        let {onSelect, style, prefixCls, value, jsxtype, jsxfrom, jsxto, disabledDate, panel, ...others} = me.props;
        let from = !!jsxfrom ? me.processTime(jsxfrom) : -Infinity;
        let to = !!jsxto ? me.processTime(jsxto) : Infinity;
        let mode = me.props.jsxmode || me.props.mode;
        if (mode == Constants.MODE.EDIT) {
            const Panel = CalendarPanel[panel];
            if (jsxtype == "single") {
                return <Panel
                        value={me.state.value}
                        onSelect={me.handleChange.bind(me)}
                        disabledDate={disabledDate ? disabledDate : (current, value) => {
                            // if showTime is true or timePicker is set, we use time to compare
                            // otherwise we use day to compare
                            if (!current) {
                                return false;
                            }

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
                arr.push(<Panel
                        key="calendar1"
                        onSelect={me.handleCascadeChange.bind(me, 0)}
                        disabledDate={(current, value) => {
                            if (!current) {
                                return false;
                            }
                            let now = me.processTime(current.getTime());
                            return (now < from || now > to)
                        }}
                        {...others1}/>);
                arr.push(<span key="split" className="kuma-uxform-split">-</span>)

                arr.push(<Panel
                        key="calendar2"
                        onSelect={me.handleCascadeChange.bind(me, 1)}
                        disabledDate={(current, value) => {
                            if (!current) {
                                return false;
                            }
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
    panel: React.PropTypes.string,
    useFormat: React.PropTypes.bool,
});
DateFormField.defaultProps = assign(FormField.defaultProps, {
    locale: 'zh-cn',
    hasTrigger: true,
    jsxtype: 'single',
    panel: 'day',
    useFormat: false,
});
module.exports = DateFormField;
