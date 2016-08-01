/**
 * DateFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let DateFormField = require('../src');
let Form = require('uxcore-form/build/Form');
let Button = require('uxcore-button');
let Const = require('uxcore-const');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: Const.MODE.EDIT
        }
    }

    handleModeChange() {
        let me = this;
        me.setState({
            mode: me.state.mode == Const.MODE.EDIT ? Const.MODE.VIEW : Const.MODE.EDIT
        })
    }

    handleValueGet() {
        let me = this;
        console.log(me.refs.form.getValues());
    }

    render() {
        let me = this;
        return (
            <div>
                <Form jsxmode={me.state.mode} ref="form">
                    <DateFormField showTime format="yyyy-MM-dd HH:mm:ss" jsxname="date" jsxlabel="日期" locale="zh-cn" />
                    <DateFormField jsxtype="cascade" useFormat format="yyyy-MM-dd" jsxname="format" jsxlabel="useFormat" locale="zh-cn" />
                    <DateFormField jsxtype="cascade" jsxname="casDate" jsxlabel="级联日期" format="yyyy/MM/dd" jsxto="2016-08-15" showDateInput />
                </Form>
                <Button onClick={me.handleModeChange.bind(me)}>切换模式</Button>
                <Button onClick={me.handleValueGet.bind(me)}>获取数据</Button>

            </div>
        );
    }
};

module.exports = Demo;
