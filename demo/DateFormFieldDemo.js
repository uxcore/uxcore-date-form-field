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

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Form>
                <DateFormField format="yyyy-MM-dd HH:mm:ss" jsxname="date" jsxlabel="日期" jsxto={new Date().setDate(new Date().getDate() + 1)} locale="zh-cn" />
                <DateFormField jsxtype="cascade" jsxname="casDate" jsxlabel="级联日期" format="yyyy/MM/dd" />
            </Form>
        );
    }
};

module.exports = Demo;
