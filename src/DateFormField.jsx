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
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import Formatter from 'uxcore-formatter';
import createSelector from './createSelector'

const CalendarPanel = {
  month: Calendar.MonthCalendar,
  year: Calendar.YearCalendar,
  day: Calendar,
};

const getMode = props => props.jsxmode || props.mode;

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
    const { jsxtype, autoMatchWidth, jsxshow } = this.props;
    const mode = getMode(this.props);
    if (jsxtype === 'cascade' && autoMatchWidth && mode === Constants.MODE.EDIT && jsxshow) {
      this.resize();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    super.componentDidUpdate(prevProps, prevState, snapshot);
    const {
      jsxtype, autoMatchWidth, jsxshow, panel,
    } = this.props;
    const mode = getMode(this.props);
    if (jsxtype === 'cascade' && autoMatchWidth && mode === Constants.MODE.EDIT && jsxshow) {
      const shouldResize = () => {
        if (!prevProps.jsxshow) {
          return true;
        }
        const prevMode = getMode(prevProps);
        if (mode !== prevMode) {
          return true;
        }
        if (panel !== prevProps.panel) {
          return true;
        }
        if (this.fieldWidth && this.fieldWidth !== parseInt(this.cascadeBox.clientWidth, 10)) {
          return true;
        }
        return false;
      };
      if (shouldResize()) {
        this.resize(true);
      }
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
  }

  resize(force) {
    const { cascadeBox } = this;
    if (this.fieldWidth
      && this.fieldWidth === parseInt(cascadeBox.clientWidth, 10)
      && force !== true) {
      return;
    }
    const calendar1 = this.calendar1.getTriggerNode();
    const calendar2 = this.calendar2.getTriggerNode();
    const { split } = this;
    this.fieldWidth = parseInt(cascadeBox.clientWidth, 10);
    if (this.fieldWidth % 2 === 1) {
      split.style.width = '5px';
    }
    const splitCurrentStyle = split.currentStyle || window.getComputedStyle(split);
    const splitOuterWidth = split.clientWidth
      + parseInt(splitCurrentStyle.marginLeft, 10)
      + parseInt(splitCurrentStyle.marginRight, 10);
    if (!splitOuterWidth) {
      // if style is loaded later than component
      this.resizeTimer = setTimeout(() => {
        this.resize();
      }, 500);
    }
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
    const values = [
      ...(this.formatValue(me.state.value) || [])
    ];
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
    me.handleDataChange(this.reverseFormatValue(values));
  }

  handleCascadeSelect = (start, end) => {
    this.handleCascadeChange(0, new Date(start), start);
    setTimeout(() => {
      this.handleCascadeChange(1, new Date(end), end)
    })
  };

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

  formatValue(value) {
    const { useStartEnd } = this.props;
    return DateFormField.metadataAdapter(value, useStartEnd)
  }

  reverseFormatValue(value) {
    const { useStartEnd } = this.props;
    return DateFormField.metadataAdapter(value, useStartEnd, true)
  }

  static metadataAdapter(value, useStartEnd, reversion) {
    if (!value) {
      return null
    }
    if (!useStartEnd) {
      return value
    }
    return !reversion
      ? [
        value.start || value.startDate,
        value.end || value.endDate
      ]
      : {
        start: value[0],
        end: value[1]
      }
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
      }
      if (jsxtype === 'cascade') {
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

        const formatValue = me.formatValue(me.state.value);

        if (formatValue && formatValue[0]) {
          others1 = assign({}, others, {
            value: formatValue[0],
          }, omitBy(propsFromArray1, isNil));
        } else {
          others1 = assign({}, others, {
            value: null,
          }, omitBy(propsFromArray1, isNil));
        }
        if (formatValue && formatValue[1]) {
          others2 = assign({}, others, {
            value: formatValue[1],
          }, omitBy(propsFromArray2, isNil));
        } else {
          others2 = assign({}, others, {
            value: null,
          }, omitBy(propsFromArray2, isNil));
        }

        const Calendar1 = <Panel
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
        />;

        const Calendar2 = <Panel
          key="calendar2"
          ref={me.saveRef('calendar2')}
          onSelect={me.handleCascadeChange.bind(me, 1)}
          disabledDate={(current) => {
            if (!current) {
              return false;
            }
            const now = me.processTime(current.getTime());
            let first = formatValue ? formatValue[0] : 0;
            first = me.processTime(first);
            return (now < from || now > to || now < first);
          }}
          {...others2}
        />;
        arr.push(
          me.props.dateRanges.length ? createSelector(
            Calendar1,
            me.props.dateRanges,
            me.handleCascadeSelect.bind(me),
            'tip1'
          ) : Calendar1
        );
        arr.push(
          <span
            style={{ width: '8px', borderBottom: '1px solid rgba(31,56,88,0.20)' }}
            key="split"
            ref={me.saveRef('split')}
            className="kuma-uxform-split"
          />
        );
        arr.push(
          me.props.dateRanges.length ? createSelector(
            Calendar2,
            me.props.dateRanges,
            me.handleCascadeSelect.bind(me),
            'tip2'
          ) : Calendar2
        );
        return (
          <div
            className="kuma-date-uxform-field-cascade"
            ref={(c) => {
              this.cascadeBox = c;
            }}
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
        return (
          <span>
            {getViewText(me.state.value, (me.props.format || defaultFormat))}
          </span>
        );
      }
      const formatValue = me.formatValue(me.state.value);

      return (
        <span>
          {
            formatValue instanceof Array
              ? formatValue.map(item => getViewText(item, (me.props.format || defaultFormat))).join(' - ')
              : formatValue
          }
        </span>
      );
    }
    return null;
  }
}

DateFormField.displayName = 'DateFormField';
DateFormField.propTypes = assign(FormField.propTypes, {
  locale: PropTypes.string,
  jsxtype: PropTypes.string,
  panel: PropTypes.string,
  useFormat: PropTypes.bool,
  autoMatchWidth: PropTypes.bool,
  dateRanges: PropTypes.array
});
DateFormField.defaultProps = assign(FormField.defaultProps, {
  locale: 'zh-cn',
  hasTrigger: true,
  jsxtype: 'single',
  autoMatchWidth: false,
  panel: 'day',
  useFormat: false,
  dateRanges: []
});
export default DateFormField;
