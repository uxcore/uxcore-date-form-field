import React from 'react'
import PropTypes from 'prop-types'


class DateRangeSelector extends React.Component{
  static defaultProps = {
    dateRanges: [],
    onSelect: () => {}
  };
  static propTypes = {
    dateRanges: PropTypes.array,
    onSelect: PropTypes.func
  };

  onSelectHandle = (start, end) => {
    this.props.onSelect(start, end)
  };

  render() {
    const { dateRanges, prefixCls } = this.props;
    return (
      dateRanges.map(range => {
        const { text, value } = range;
        return (
          <span
            className={`${prefixCls}-range-selector`}
            onClick={() => this.onSelectHandle(value.start, value.end)}
            key={text}
          >
            {text}
          </span>
        )
      })
    )
  }
}

export default DateRangeSelector