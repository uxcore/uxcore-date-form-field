/**
 * DateFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

import Form from 'uxcore-form/build/Form';

import Button from 'uxcore-button';
import Const from 'uxcore-const';
import React from 'react';
import DateFormField from '../src';


class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: Const.MODE.EDIT,
      jsxshow: true,
    };
  }

  handleModeChange() {
    const me = this;
    me.setState({
      mode: me.state.mode === Const.MODE.EDIT ? Const.MODE.VIEW : Const.MODE.EDIT,
      jsxshow: !this.state.jsxshow,
    });
  }

  handleValueGet() {
    const me = this;
    console.log(me.form.getValues());
  }

  render() {
    const me = this;
    return (
      <div>
        <Form
          className="testWidth"
          jsxmode={me.state.mode}
          ref={(c) => {
            me.form = c;
            return false;
          }}
          jsxvalues={{
            date: '2019-06-24',
            casDate: ['2016-01-02', '2017-02-03'],
            cas1Date: '',
            casMetaDate: {
              start: '2016-01-11',
              end: '2016-02-12'
            }
          }}
        >
          <DateFormField
            fixTimezoneOffset
            showTime={false}
            size="small"
            format="yyyy-MM-dd"
            jsxname="date"
            jsxlabel="日期"
            locale="zh-cn"
            className="testField"
          />
          {/*<DateFormField*/}
            {/*jsxtype="cascade"*/}
            {/*autoMatchWidth*/}
            {/*jsxshow={this.state.jsxshow}*/}
            {/*useFormat*/}
            {/*format="yyyy-MM-dd"*/}
            {/*jsxfrom="2016-11-24"*/}
            {/*jsxname="format"*/}
            {/*jsxlabel="useFormat"*/}
            {/*locale="zh-cn"*/}
          {/*/>*/}

          <DateFormField
            jsxtype="cascade"
            jsxname="casMetaDate"
            fixTimezoneOffset
            jsxmod={this.state.mode}
            useFormat
            format="yyyy-MM-dd"
            jsxlabel="元数据格式"
            useStartEnd={true}
            locale="zh-cn"
          />

          <DateFormField
            jsxtype="cascade"
            jsxname="cas1Date"
            jsxmod={this.state.mode}
            useFormat={false}
            format="yyyy-MM-dd HH:mm:ss"
            showTime={true}
            jsxlabel="defaultValue"
            locale="zh-cn"
            // defaultValue={[1557546173672, 1558755936885]}
          />

          <DateFormField
            jsxtype="cascade"
            jsxname="casDate"
            jsxmod={this.state.mode}
            jsxlabel="快捷选择"
            quickSelectRanges={[
              {
                text: '本周',
                value: {
                  start: '2018-11-12',
                  end: '2018-11-19'
                }
              },
              {
                text: '本月',
                value: {
                  start: '2018-11-01',
                  end: '2018-11-30'
                }
              },
              {
                text: '本周1',
                value: {
                  start: '2018-11-12',
                  end: '2018-11-19'
                }
              },
              {
                text: '本月1',
                value: {
                  start: '2018-11-01',
                  end: '2018-11-30'
                }
              },
              {
                text: '本周2',
                value: {
                  start: '2018-11-12',
                  end: '2018-11-19'
                }
              },
              {
                text: '本月3',
                value: {
                  start: '2018-11-01',
                  end: '2018-11-30'
                }
              },
              {
                text: '本周4',
                value: {
                  start: '2018-11-12',
                  end: '2018-11-19'
                }
              },
              {
                text: '本月5',
                value: {
                  start: '2018-11-01',
                  end: '2018-11-30'
                }
              },
              {
                text: '2018-S2',
                value: {
                  start: '2018-10-01',
                  end: '2019-03-31'
                }
              }
            ]}
            locale="zh-cn"
          />
          {/*<DateFormField*/}
            {/*jsxtype="cascade"*/}
            {/*jsxname="casDate"*/}
            {/*jsxlabel="级联日期"*/}
            {/*panel="year"*/}
            {/*showTime*/}
            {/*showDateInput*/}
          {/*/>*/}
        </Form>
        <Button onClick={me.handleModeChange.bind(me)}>
          切换模式
        </Button>
        <Button onClick={me.handleValueGet.bind(me)}>
          获取数据
        </Button>
        <Button onClick={() => { this.forceUpdate(); }}>
          强制渲染
        </Button>
      </div>
    );
  }
}

export default Demo;
