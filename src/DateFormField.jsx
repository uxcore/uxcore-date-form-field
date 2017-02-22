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
const Calendar = require('uxcore-calendar');
const assign = require('object-assign');
const deepcopy = require('lodash/cloneDeep');
const omitBy = require('lodash/omitBy');
const isNil = require('lodash/isNil');
const Formatter = require('uxcore-formatter');
const addEventListener = require('rc-util/lib/Dom/addEventListener');

const CalendarPanel = {
  month: Calendar.MonthCalendar,
  year: Calendar.YearCalendar,
  day: Calendar,
};

const getIEVer = () => {
  if (window) {
    const ua = window.navigator.userAgent;
    const idx = ua.indexOf('MSIE');
    if (idx > 0) {
      // "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64;
      // Trident/6.0; SLCC2; .NET CLR 2.0.50727)"
      return parseInt(ua.substring(idx + 5, ua.indexOf('.', idx)), 10);
    }
    if (ua.match(/Trident\/7\./)) {
      // "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2;
      // .NET CLR 2.0.50727; rv:11.0) like Gecko"
      return 11;
    }
    return 0;
  }
  return 0;
};

const getPropFromArray = (arr, index) => {
  if (arr instanceof Array) {
    return arr[index];
  }
  return arr;
};

const getViewText = (value, format) => {
  const date = new Date(value);
  if (isNaN(date)) {
    return value;
  }
  return Formatter.date(value, format);
};

class DateFormField extends FormField {

  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    const me = this;
    const { jsxtype, autoMatchWidth } = me.props;
    if (jsxtype === 'cascade' && autoMatchWidth) {
      this.resize();
      this.resizeListenner = addEventListener(window, 'resize', this.resize);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.resizeListenner) {
      this.resizeListenner.remove();
    }
  }

  resize() {
    const fieldCore = this.getFieldCore();
    if (this.fieldWidth && this.fieldWidth === parseInt(fieldCore.clientWidth, 10)) {
      return;
    }
    const calendar1 = this.calendar1.getTriggerNode();
    const calendar2 = this.calendar2.getTriggerNode();
    const split = this.split;
    this.fieldWidth = parseInt(fieldCore.clientWidth, 10);
    const isIE = getIEVer() >= 8;
    if (this.fieldWidth % 2 === 1) {
      split.style.width = '5px';
    }
    const splitCurrentStyle = split.currentStyle || window.getComputedStyle(split);
    const splitOuterWidth = split.clientWidth
      + parseInt(splitCurrentStyle.marginLeft, 10)
      + parseInt(splitCurrentStyle.marginRight, 10);
    const calendarWidth = (this.fieldWidth - splitOuterWidth) / 2;
    // in IE, if the core width has decimal, like 280.95px;
    // the clientWidth would be 281, and would cause break line if 281 is used
    if (isIE) {
      split.style.width = `${parseInt(split.style.width, 10) - 1}px`;
    }
    calendar1.style.width = `${calendarWidth}px`;
    calendar2.style.width = `${calendarWidth}px`;
  }


  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  handleChange(value, format) {
    const me = this;
    const { useFormat } = me.props;
    let data;
    if (useFormat) {
      data = format;
    } else {
      data = value ? me.processTime(value) : null;
    }
    me.handleDataChange(data);
  }

  handleCascadeChange(i, value, format) {
    const me = this;
    const values = deepcopy(me.state.value) || [];
    const { useFormat } = me.props;
    let data;
    if (useFormat) {
      data = format;
    } else {
      data = value ? me.processTime(value) : undefined;
    }
    values[i] = data;
    if (value) {
      if (i === 0
        && !!values[1]
        && me.processTime(value) > me.processTime(values[1])) {
        values.pop();
      }
      if (i === 1
        && !!values[0]
        && me.processTime(value) < me.processTime(values[0])) {
        values[0] = undefined;
      }
    }
    me.handleDataChange(values);
  }

  addSpecificClass() {
    const me = this;
    if (me.props.jsxprefixCls === 'kuma-uxform-field') {
      let str = `${me.props.jsxprefixCls} kuma-date-uxform-field`;
      if (me.props.jsxtype === 'cascade') {
        str += ' kuma-cascade-date-uxform-field';
      }
      return str;
    }
    return me.props.jsxprefixCls;
  }

  processTime(time) {
    // if showTime is true or timePicker is set, we use time to compare
    // otherwise we use day to compare
    const me = this;
    const { showTime, timePicker } = me.props;
    if (showTime || timePicker) {
      return new Date(time).getTime();
    }
    const newTime = new Date(time);
    newTime.setHours(0);
    newTime.setMinutes(0);
    newTime.setSeconds(0);
    newTime.setMilliseconds(0);
    return newTime.getTime();
    // new Date(dateString) will parse time as UTC+0!
    // return new Date(Formatter.date(time, 'YYYY-MM-DD')).getTime();
  }

  renderField() {
    const me = this;
    /* eslint-disable no-unused-vars */
    const {
      onSelect,
      style,
      prefixCls,
      value,
      jsxtype,
      jsxfrom,
      jsxto,
      disabledDate,
      panel,
      ...others
    } = me.props;
    /* eslint-enable no-unused-vars */
    const from = jsxfrom ? me.processTime(jsxfrom) : -Infinity;
    const to = jsxto ? me.processTime(jsxto) : Infinity;
    const mode = me.props.jsxmode || me.props.mode;
    if (mode === Constants.MODE.EDIT) {
      const Panel = CalendarPanel[panel];
      if (jsxtype === 'single') {
        return (
          <Panel
            value={me.state.value}
            onSelect={me.handleChange.bind(me)}
            disabledDate={disabledDate || ((current) => {
              // if showTime is true or timePicker is set, we use time to compare
              // otherwise we use day to compare
              if (!current) {
                return false;
              }

              return (me.processTime(current.getTime()) < from
                || me.processTime(current.getTime()) > to);
            })}
            {...others}
          />
        );
      } else if (jsxtype === 'cascade') {
        const arr = [];
        let others1;
        let others2;
        const propsFromArray1 = {
          disabled: getPropFromArray(others.disabled, 0),
          placeholder: getPropFromArray(others.placeholder, 0),
          format: getPropFromArray(others.format, 0),
          disabledDate: getPropFromArray(disabledDate, 0),
        };

        const propsFromArray2 = {
          disabled: getPropFromArray(others.disabled, 1),
          placeholder: getPropFromArray(others.placeholder, 1),
          format: getPropFromArray(others.format, 1),
          disabledDate: getPropFromArray(disabledDate, 1),
        };
        if (me.state.value && me.state.value[0]) {
          others1 = assign({}, others, {
            value: me.state.value[0],
          }, omitBy(propsFromArray1, isNil));
        } else {
          others1 = assign({}, others, {
            value: null,
          }, omitBy(propsFromArray1, isNil));
        }
        if (me.state.value && me.state.value[1]) {
          others2 = assign({}, others, {
            value: me.state.value[1],
          }, omitBy(propsFromArray2, isNil));
        } else {
          others2 = assign({}, others, {
            value: null,
          }, omitBy(propsFromArray2, isNil));
        }
        arr.push(
          <Panel
            key="calendar1"
            ref={me.saveRef('calendar1')}
            onSelect={me.handleCascadeChange.bind(me, 0)}
            disabledDate={(current) => {
              if (!current) {
                return false;
              }
              const now = me.processTime(current.getTime());
              return (now < from || now > to);
            }}
            {...others1}
          />
        );
        arr.push(<span style={{ width: '6px' }} key="split" ref={me.saveRef('split')} className="kuma-uxform-split">-</span>);

        arr.push(
          <Panel
            key="calendar2"
            ref={me.saveRef('calendar2')}
            onSelect={me.handleCascadeChange.bind(me, 1)}
            disabledDate={(current) => {
              if (!current) {
                return false;
              }
              const now = me.processTime(current.getTime());
              let first = me.state.value ? me.state.value[0] : 0;
              first = me.processTime(first);
              return (now < from || now > to || now < first);
            }}
            {...others2}
          />
        );
        return arr;
      }
    } else if (mode === Constants.MODE.VIEW) {
      let defautFormat = 'YYYY-MM-DD';
      if (me.props.showTime || me.props.timePicker) {
        defautFormat = 'YYYY-MM-DD HH:mm:ss';
      }
      if (jsxtype === 'single') {
        return <span>{getViewText(me.state.value, (me.props.format || defautFormat))}</span>;
      }
      return (
        <span>
          {me.state.value instanceof Array ? me.state.value
              .map(item => getViewText(item, (me.props.format || defautFormat)))
              .join(' - ') : me.state.value}
        </span>
      );
      /* try {

      } catch (err) {
        console.error(err.stack);
        return (
          <span>
            {jsxtype === 'single' ? me.state.value : me.state.value.join(' ')}
          </span>
        );
      }*/
    }
    return null;
  }
}

DateFormField.displayName = 'DateFormField';
DateFormField.propTypes = assign(FormField.propTypes, {
  jsxtype: React.PropTypes.string,
  panel: React.PropTypes.string,
  useFormat: React.PropTypes.bool,
  autoMatchWidth: React.PropTypes.bool,
});
DateFormField.defaultProps = assign(FormField.defaultProps, {
  locale: 'zh-cn',
  hasTrigger: true,
  jsxtype: 'single',
  autoMatchWidth: false,
  panel: 'day',
  useFormat: false,
});
module.exports = DateFormField;
