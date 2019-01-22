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

const { Validators } = Form;

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: Const.MODE.EDIT,
    };
  }

  handleModeChange() {
    const me = this;
    me.setState({
      mode: me.state.mode === Const.MODE.EDIT ? Const.MODE.VIEW : Const.MODE.EDIT,
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
          ref={(c) => { me.form = c; return false; }}
          jsxvalues={{
            casDate: ['2016-01-02', '2016-02-03'],
          }}
        >
          <DateFormField
            showTime={false}
            size="small"
            format="yyyy-MM-dd"
            jsxname="date"
            jsxlabel="日期"
            locale="zh-cn"
            className="testField"
          />
          <DateFormField
            jsxtype="cascade"
            autoMatchWidth
            useFormat
            format="yyyy-MM-dd"
            jsxfrom="2016-11-24"
            jsxname="format"
            jsxlabel="useFormat"
            locale="zh-cn"
            required
            requireType="end"
            jsxrules={[
              { validator: Validators.isNotEmpty, errMsg: '不能为空' },
            ]}
          />
          <DateFormField
            jsxtype="cascade"
            jsxname="casDate"
            jsxlabel="级联日期"
            panel="year"
            showTime
            showDateInput
          />
        </Form>
        <Button onClick={me.handleModeChange.bind(me)}>切换模式</Button>
        <Button onClick={me.handleValueGet.bind(me)}>获取数据</Button>
      </div>
    );
  }
}

export default Demo;
