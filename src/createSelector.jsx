import React from 'react'
import HoverOmit from './HoverOmit';
import Tooltip from 'uxcore-tooltip'
import DateRangeSelector from "./DateRangeSelector";

export default function (Component, dateRanges, onSelect, tip) {
  return (
    <Tooltip key={tip} mouseEnterDelay={0.3} trigger={['hover', 'click']} overlay={() => {
      return (
        <DateRangeSelector
          dateRanges={ dateRanges }
          onSelect={ onSelect }
        />
      )
    }} placement="bottomLeft">
      <HoverOmit>
        {() => { return Component} }
      </HoverOmit>
    </Tooltip>
  )
}