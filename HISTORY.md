# history
## 0.9.13
* `FIXED` fix a bug in disabledDate when showTime is true

## 0.9.12
* `FIXED` add new prop fixTimezoneOffset for view mode

## 0.9.11
* `FIXED` add defaultValue support in cascade mode

## 0.9.10
* `CHANGE` when select a quickSelectRanges, close the tooltip

## 0.9.8
* `NEW` add new prop quickSelectRanges

## 0.9.3
* `NEW` add metadata support

## 0.9.2

* `FIXED` resize should be called if panel is changed

## 0.9.1

* `FIXED` autoMatchWidth fails to work if jsxshow is changed from false to true

## 0.9.0

* `CHANGED` upgrade `uxcore-form-field` to `^0.3.0`
* `CHANGED` upgrade `uxcore-calendar` to `^0.10.0`
* `CHANGED` adapt React 16

## 0.8.13

* `CHANGED` spliter style change

## 0.8.11

* `FIXED` more reliable autoMatchWidth if style is loaded later than component

## 0.8.10

* `CHANGED` new autoMatchWidth, more reliable

## 0.8.9

* `FIXED` cascadeBox width change cannot trigger resize when update

## 0.8.8

* `FIXED` autoSize logic go wrong if cascade wrapper's width is not equal to fieldCore's width
* `CHANGED` `inputBoxMaxWidth`, `mode` & `verticalAlign` change will call the resize

## 0.8.7

* `CHANGED` add a wrapper for cascade type

## 0.8.6

* `CHANGED` fit React@15

## 0.8.5

* `CHANGED` support size config

## 0.8.4

* `FIXED` pass `className` to `Calendar`

## 0.8.3

* `FIXED` resize bug in view mode

## 0.8.0

* `CHANGED` update `uxcore-calendar` to ~0.9.0

## 0.7.3

* `FIXED` view mode will show 1970-01-01 if value is null

## 0.7.2

* `CHANGED` use different default format in `year` & `month` panel

## 0.7.1

* `CHANGED` show key if label is not found in view mode

## 0.7.0

* `CHANGED` update `uxcore-calendar` to ~0.8.0

## 0.6.1

* `FIXED` `processTime` timezone bug (also fix in ver. 0.4.x ~ 0.5.x)

## 0.6.0

* `CHANGED` update `uxcore-calendar` to ~0.7.0

## 0.5.2

* `FIXED` use parseInt to get core width, fix the width bug in IE 11.

## 0.5.1

`CHANGED` optimize resize performance

## 0.5.0

`NEW` add new prop `autoMatchWidth`
`CHANGED` update formField to ~0.2.0

## 0.4.5

`FIXED` spread attributes with undefined key will override the previous attribute [#4](https://github.com/uxcore/uxcore-date-form-field/issues/4)

## 0.4.4

`CHANGED` use `processTime` in `handleCascadeChange` & `handleChange` method.

## 0.4.3

`CHANGED` cascade mode support `disabledDate`

## 0.4.2

`CHANGED` `format` support array

## 0.4.1

`CHANGED` js style standardization
`CHANGED` `disabled` `placeholder` support array

## 0.4.0

`CHANGED` update uxcore-calendar to ~0.6.0

## 0.3.2

`FIX` date before 1970.01.01 cannot be selected.

## 0.3.1

`NEW` support new prop `useFormat`, DateFormField will use formatted value to communicate.

## 0.3.0

`CHANGED` update dependency `uxcore-calendar` to ~0.5.0

## 0.2.3

`FIXED` fix bug when using showDateInput

## 0.2.2

`NEW` add new prop `panel` to support MonthPanel and YearPanel

## 0.2.1

`FIX` fix server render

## 0.2.0

`CHANGED` update uxcore-calendar to ~0.4.0

## 0.1.3

`CHANGED` fix view mode bug (showing timestamp)

## 0.1.2

`CHANGED` keep deepcopy version same with `uxcore-form`
