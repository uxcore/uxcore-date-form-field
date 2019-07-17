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
import RangeSelector from "./RangeSelector";
import HoverObserver  from 'react-hover-observer'
import Tooltip from 'uxcore-tooltip'
import Message from 'uxcore-message'

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



class DateFormField extends FormField {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  getViewText(value, format){
    const date = new Date(value);
    if (isNaN(date) || value === null) {
      return value;
    }
    const localTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60 * 1000;
    value = this.props.fixTimezoneOffset ? localTime + localOffset : value;
    return Formatter.date(value, format);
  };

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
        && !me.props.showTime && me.processTime(value) < me.processTime(values[0])) {
        values[0] = undefined;
      }
      if (i === 1 && me.props.showTime) {
        const first = new Date(me.state.value[0])
        const second = new Date(value)
        if (
          first.getFullYear() === second.getFullYear() &&
          first.getMonth() === second.getMonth() &&
          first.getDate() === second.getDate()
        ) {
          if (second.getHours() < first.getHours() || second.getHours() === first.getHours() && second.getMinutes() < first.getMinutes()) {
            Message.error(me.props.locale === 'zh-cn' ? '起始时间晚于结束时间，请确认后重新选择' : 'The start time is later than the end time, please check & choose again!')
          }
        }
      }
    }
    me.handleDataChange(this.reverseFormatValue(values));
  }

  hideToolTip() {
    const { toolTip } = this.refs;
    if (!toolTip || !toolTip.getPopupDomNode) {
      return
    }
    const toolTipNode = toolTip.getPopupDomNode();
    toolTipNode && toolTipNode.classList.add('kuma-tooltip-hidden');
  }

  handleCascadeSelect = (start, end) => {
    this.handleCascadeChange(0, new Date(start), start);
    setTimeout(() => {
      this.handleCascadeChange(1, new Date(end), end)
      this.hideToolTip()
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
      defaultValue,
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
            defaultValue={defaultValue}
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
        const { quickSelectRanges } = me.props;
        const propsFromArray1 = {
          disabled: getPropFromArray(others.disabled, 0),
          placeholder: getPropFromArray(others.placeholder, 0),
          format: getPropFromArray(others.format, 0),
          disabledDate: getPropFromArray(disabledDate, 0),
          defaultValue: getPropFromArray(defaultValue, 0)
        };

        const propsFromArray2 = {
          disabled: getPropFromArray(others.disabled, 1),
          placeholder: getPropFromArray(others.placeholder, 1),
          format: getPropFromArray(others.format, 1),
          disabledDate: getPropFromArray(disabledDate, 1),
          defaultValue: getPropFromArray(defaultValue, 1)
        };

        const formatValue = me.formatValue(me.state.value);

        if (formatValue && formatValue[0]) {
          others1 = assign({}, others, {
            value: formatValue[0],
          }, omitBy(propsFromArray1, isNil));
        } else {
          others1 = assign({}, others, {
            value: null,
            defaultValue: propsFromArray1.defaultValue || undefined
          }, omitBy(propsFromArray1, isNil));
        }
        if (formatValue && formatValue[1]) {
          others2 = assign({}, others, {
            value: formatValue[1],
          }, omitBy(propsFromArray2, isNil));
        } else {
          others2 = assign({}, others, {
            value: null,
            defaultValue: propsFromArray2.defaultValue || undefined
          }, omitBy(propsFromArray2, isNil));
        }

        const Calendar1 = <Panel
          key="calendar1"
          ref={me.saveRef('calendar1')}
          onSelect={me.handleCascadeChange.bind(me, 0)}
          onOpenChange={(iShow) => {
            me.props.onOpenChange && me.props.onOpenChange.call(me, iShow);
            me.hideToolTip()
          }}
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
          onOpenChange={(iShow) => {
            me.props.onOpenChange && me.props.onOpenChange.call(me, iShow);
            me.hideToolTip()
          }}
          onSelect={me.handleCascadeChange.bind(me, 1)}
          disabledDate={(current) => {
            if (!current) {
              return false;
            }
            const now = me.processTime(current.getTime());
            let first = formatValue ? formatValue[0] : 0;
            //如果显示时间，需要将时间点前移到当前日期的0点
            if (me.props.showTime && first) {
              if (typeof first === "number") {
                first = Formatter.date(first, me.props.format || 'YYYY-MM-DD HH:mm:ss')
              }
              first = first.replace(/\d{1,2}:\d{1,2}:\d{1,2}/, '00:00:00')
            }
            first = me.processTime(first);
            return (now < from || now > to || now < first);
          }}
          {...others2}
        />;
        arr.push(Calendar1);
        arr.push(
          <span
            style={{ width: '8px', borderBottom: '1px solid rgba(31,56,88,0.20)' }}
            key="split"
            ref={me.saveRef('split')}
            className="kuma-uxform-split"
          />
        );
        arr.push(Calendar2);
        return (
          <div
            className="kuma-date-uxform-field-cascade"
            ref={(c) => {
              this.cascadeBox = c;
            }}
          >
            { quickSelectRanges.length ? <Tooltip
              className={'quick-selector-wrapper'}
              ref={'toolTip'}
              overlayClassName={'date-quick-range-selector'}
              overlay={() => {
                return (
                  <RangeSelector
                    dateRanges={quickSelectRanges}
                    onSelect={me.handleCascadeSelect}
                  />
                )
              }}
              placement="bottomLeft"
            >
              <HoverObserver>
                {arr}
              </HoverObserver>
            </Tooltip> : arr }
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
            {this.getViewText(me.state.value, (me.props.format || defaultFormat))}
          </span>
        );
      }
      const formatValue = me.formatValue(me.state.value);

      return (
        <span>
          {
            formatValue instanceof Array
              ? formatValue.map(item => this.getViewText(item, (me.props.format || defaultFormat))).join(' - ')
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
  quickSelectRanges: PropTypes.array,
  fixTimezoneOffset: PropTypes.bool
});
DateFormField.defaultProps = assign(FormField.defaultProps, {
  locale: 'zh-cn',
  hasTrigger: true,
  jsxtype: 'single',
  autoMatchWidth: false,
  panel: 'day',
  useFormat: false,
  quickSelectRanges: [],
  fixTimezoneOffset: false
});
export default DateFormField;
