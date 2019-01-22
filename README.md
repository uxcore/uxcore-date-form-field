---

## uxcore-date-form-field [![Dependency Status](http://img.shields.io/david/uxcore/uxcore-date-form-field.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-date-form-field) [![devDependency Status](http://img.shields.io/david/dev/uxcore/uxcore-date-form-field.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-date-form-field#info=devDependencies) 

## TL;DR

uxcore-date-form-field ui component for react

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-date-form-field
$ cd uxcore-date-form-field
$ npm install
$ npm run start
```

## Usage

```
<Form
    jsxmode={this.state.mode}
    ref={(c) => { this.form = c; }}
    jsxvalues={{
        testDate: '',
        casDate: ['2016-01-02', '2016-02-03'],
    }}
>
    <DateFormField
        showTime={false}
        format="yyyy-MM-dd"
        jsxname="date"
        jsxlabel="日期"
        locale="zh-cn"
        className="testDate"
    />
    <DateFormField
        jsxtype="cascade"
        autoMatchWidth
        useFormat
        format="yyyy-MM-dd"
        jsxfrom="2016-11-24"
        jsxname="format"
        jsxlabel="日期区间"
        locale="zh-cn"
        required
        requireType="end"
        jsxrules={[
            { validator: Validators.isNotEmpty, errMsg: '不能为空' },
        ]}
    />
</Form>
```

更多请参阅 Form 文档。

## Props

支持 FormField 公共的 Props 职位还支持以下 Props：

| 配置项 | 类型 | 必填 | 默认值 | 功能/备注 |
|---|---|---|---|---|
|jsxtype|string|optional|single|single/cascade 单独、级联|
|jsxfrom|string|optional|-|开始日期|
|jsxto|string|optional|-|结束日期|
|panel|string|optional|"day"|何种面板,枚举值为"month","year"和"day"|
|autoMatchWidth|boolean|optional|false|从 1.8.11 版本支持，在级联状态下输入框自动匹配宽度|
|requireType|string|optional|-|必填校验方式，有4个可选值，见 [requireType](#requireType) 说明|

除此之外，支持除 onSelect，[uxcore-calendar](https://www.npmjs.com/package/uxcore-calendar) 的所有 props。

### requireType

用于定义在级联模式下的必填校验规则，默认不传的情况的建议逻辑是 any，即任意填写一项即可。

- start 区间开始时间必填
- end 区间结束时间必填
- both 区间开始时间和结束时间均必填
- any 区间开始时间和结束时间任意填写一项