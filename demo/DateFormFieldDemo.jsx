/**
 * DateFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const Form = require('uxcore-form/build/Form');
const Button = require('uxcore-button');
const Const = require('uxcore-const');
const React = require('react');

const DateFormField = require('../src');


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
        >
          <DateFormField
            showTime={false}
            format="yyyy-MM-dd"
            jsxname="date"
            jsxlabel="日期"
            locale="zh-cn"
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
          />
          <DateFormField
            jsxtype="cascade"
            jsxname="casDate"
            jsxlabel="级联日期"
            format="yyyy-MM-dd HH:mm:ss"
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

module.exports = Demo;
