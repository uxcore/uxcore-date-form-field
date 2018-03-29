/**
 * DateFormField Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from 'uxcore-form-field';
import Constants from 'uxcore-const';
import Calendar from 'uxcore-calendar';
import assign from 'object-assign';
import deepcopy from 'lodash/cloneDeep';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import Formatter from 'uxcore-formatter';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

const CalendarPanel = {
  month: Calendar.MonthCalendar,
  year: Calendar.YearCalendar,
  day: Calendar,
};

const getMode = props => props.jsxmode || props.mode;
const getVerticalAlign = (props) => {
  // jsxVerticalAlign is an internal varible.
  let align = props.verticalAlign;
  if (align === undefined) {
    align = props.jsxVerticalAlign;
  }
  return align;
};

const getMaxWidth = props => props.inputBoxMaxWidth;

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
  if (isNaN(date) || value === null) {
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
    const { jsxtype, autoMatchWidth } = this.props;
    const mode = getMode(this.props);
    if (jsxtype === 'cascade' && autoMatchWidth && mode === Constants.MODE.EDIT) {
      this.resize();
    }
  }

  resize(force) {
    const cascadeBox = this.cascadeBox;
    if (this.fieldWidth
      && this.fieldWidth === parseInt(cascadeBox.clientWidth, 10)
      && force !== true) {
      return;
    }
    const calendar1 = this.calendar1.getTriggerNode();
    const calendar2 = this.calendar2.getTriggerNode();
    const split = this.split;
    this.fieldWidth = parseInt(cascadeBox.clientWidth, 10);
    if (this.fieldWidth % 2 === 1) {
      split.style.width = '5px';
    }
    const splitCurrentStyle = split.currentStyle || window.getComputedStyle(split);
    const splitOuterWidth = split.clientWidth
      + parseInt(splitCurrentStyle.marginLeft, 10)
      + parseInt(splitCurrentStyle.marginRight, 10);
    calendar1.style.width = `calc((100% - ${splitOuterWidth}px)/2)`;
    calendar2.style.width = `calc((100% - ${splitOuterWidth}px)/2)`;
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
    const {
      jsxtype,
      jsxfrom,
      jsxto,
      disabledDate,
      panel,
      ...others
    } = me.props;

    // remove props which cannot be passed.
    ['onSelect', 'style', 'prefixCls', 'value', 'className'].forEach((key) => {
      delete others[key];
    });

    others.size = this.getSize();

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
          />,
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
          />,
        );
        return (
          <div
            className={'kuma-date-uxform-field-cascade'}
            ref={(c) => { this.cascadeBox = c; }}
          >
            {arr}
          </div>
        );
      }
    } else if (mode === Constants.MODE.VIEW) {
      let defaultFormat = 'YYYY-MM-DD';
      if (me.props.showTime || me.props.timePicker) {
        defaultFormat = 'YYYY-MM-DD HH:mm:ss';
      }
      if (panel === 'month') {
        defaultFormat = 'YYYY-MM';
      }
      if (panel === 'year') {
        defaultFormat = 'YYYY';
      }
      if (jsxtype === 'single') {
        return <span>{getViewText(me.state.value, (me.props.format || defaultFormat))}</span>;
      }
      return (
        <span>
          {me.state.value instanceof Array ? me.state.value
            .map(item => getViewText(item, (me.props.format || defaultFormat)))
            .join(' - ') : me.state.value}
        </span>
      );
    }
    return null;
  }
}

DateFormField.displayName = 'DateFormField';
DateFormField.propTypes = assign(FormField.propTypes, {
  jsxtype: PropTypes.string,
  panel: PropTypes.string,
  useFormat: PropTypes.bool,
  autoMatchWidth: PropTypes.bool,
});
DateFormField.defaultProps = assign(FormField.defaultProps, {
  locale: 'zh-cn',
  hasTrigger: true,
  jsxtype: 'single',
  autoMatchWidth: false,
  panel: 'day',
  useFormat: false,
});
export default DateFormField;
