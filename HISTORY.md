# history

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