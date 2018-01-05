import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import Form from 'uxcore-form/build/Form';
import Constants from 'uxcore-const';
import $ from 'jquery';
import DateFormField from '../src';

Enzyme.configure({ adapter: new Adapter() });

const createDateField = (options = {}, values = {}) => {
  const opts = {
    jsxname: 'test-name',
    jsxlabel: 'test',
    jsxtype: 'single', // or cascade
    jsxfrom: '',
    jsxto: '',
    panel: 'day', // month or year or day
    autoMatchWidth: false,
  };
  return (
    <Form jsxvalues={values}>
      {React.createElement(DateFormField, { ...opts, ...options })}
    </Form>
  );
};

describe('DateFormField', () => {
  let div = null;

  beforeEach(() => {
    div = document.createElement('div');
    div.id = 'test-demo';
    document.body.appendChild(div);
  });

  afterEach(() => {
    document.body.removeChild(div);
    $('.uxcore').remove();
  });

  describe('Constructor Method', () => {
    it('call constructor correctly', () => {
      const w = mount(createDateField());
      expect(w.find(DateFormField).prop('jsxtype')).to.be('single');
      expect(w.find(DateFormField).prop('jsxfrom')).to.be('');
      expect(w.find(DateFormField).prop('jsxto')).to.be('');
      expect(w.find(DateFormField).prop('panel')).to.be('day');
      expect(w.find(DateFormField).prop('autoMatchWidth')).to.be(false);
    });
  });

  describe('Render Field Test', () => {
    it('render cascade date form field', (done) => {
      const w = mount(createDateField({ jsxtype: 'cascade' }));
      expect(w.find(DateFormField).prop('jsxtype')).to.be('cascade');
      ReactDOM.render(createDateField(), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-calendar-picker-input').length).to.be(1);
        done();
      }, 100);
    });

    it('render autoMatchWidth date form field', () => {
      const w = mount(createDateField({ jsxtype: 'cascade', autoMatchWidth: true }));
      const d = w.find(DateFormField);
      expect(d.prop('autoMatchWidth')).to.be(true);
      expect(d.instance().resizeListenner.remove).to.be.a('function');
    });

    it('render showtime date form field', (done) => {
      const w = mount(createDateField({ jsxtype: 'cascade', showtime: true }));
      expect(w.find(DateFormField).prop('showtime')).to.be(true);
      ReactDOM.render(createDateField({ jsxtype: 'cascade', showtime: true }), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-calendar-picker-input').length).to.be(2);
        done();
      }, 100);
    });

    it('render jsxlabel with date form field', (done) => {
      const w = mount(createDateField({ jsxlabel: 'date2333' }));
      expect(w.find(DateFormField).prop('jsxlabel')).to.be('date2333');
      ReactDOM.render(createDateField({ jsxlabel: 'date2333' }), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-uxform-field .label-content').text()).to.be('date2333');
        done();
      }, 100);
    });

    it('render date form field with different formatter', () => {
      const w = mount(createDateField({ jsxtype: 'cascade', format: 'yyyy' }));
      expect(w.find(DateFormField).prop('format')).to.be('yyyy');
      w.unmount();
    });

    it('render the read view not editable', (done) => {
      ReactDOM.render(createDateField({
        jsxname: 'date',
        jsxlabel: 'date2333',
        jsxmode: Constants.MODE.VIEW,
      }, {
        date: '2012-11-12',
      }), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-input').length).to.be(0);
        expect($('.kuma-uxform-field-core span').text())
          .to.be('2012-11-12');
        done();
      }, 100);
    });

    it('render the read view not editable with timer', (done) => {
      ReactDOM.render(createDateField({
        jsxlabel: 'date2333',
        jsxname: 'date',
        jsxmode: Constants.MODE.VIEW,
        showTime: true,
      }, {
        date: '2012-11-12',
      }), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-input').length).to.be(0);
        expect($('.kuma-uxform-field-core span').text())
          .to.contain(':00:00');
        done();
      }, 100);
    });

    it('render the date form field with initial value', (done) => {
      ReactDOM.render(createDateField({
        jsxlabel: 'date2333',
        jsxmode: Constants.MODE.VIEW,
      }), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-input').length).to.be(0);
        done();
      }, 100);
    });

    it('render the date form field with initial value', (done) => {
      ReactDOM.render(createDateField({
        useFormat: true,
        jsxname: 'date',
        format: 'yyyy-MM-dd',
        jsxlabel: 'date2333',
        jsxmode: Constants.MODE.VIEW,
        jsxtype: 'cascade',
      }, {
        date: ['2012-11-12', '2012-12-12'],
      }), document.getElementById('test-demo'));
      setTimeout(() => {
        expect($('.kuma-input').length).to.be(0);
        expect($('.kuma-uxform-field-core span').text())
          .to.be('2012-11-12 - 2012-12-12');
        done();
      }, 100);
    });

    it('autoMatchWidth in cascade mode', (done) => {
      const div2 = document.createElement('div');
      document.body.appendChild(div2);
      const wrapper = mount(
        <div style={{ width: '800px' }} className="test-for-auto-match-width">
          <DateFormField jsxtype="cascade" standalone autoMatchWidth />
        </div>
        , {
          attachTo: div2,
        });
      setTimeout(() => {
        expect(wrapper.find('input.kuma-input').at(0).getDOMNode().offsetWidth).to.be((800 - 88 - 24 - 26) / 2);
        wrapper.find('.test-for-auto-match-width').hostNodes().getDOMNode().style.width = '600px';
        wrapper.find(DateFormField).instance().forceUpdate();
        expect(wrapper.find('input.kuma-input').at(0).getDOMNode().offsetWidth).to.be((600 - 88 - 24 - 26) / 2);
        wrapper.unmount();
        document.body.removeChild(div2);
        done();
      }, 500);
    });
  });

  describe('Event Test', () => {
    it('single date form field support onClick and onChange event to show picker panel', (done) => {
      ReactDOM.render(createDateField({ jsxlabel: 'date2333' }), document.getElementById('test-demo'));
      setTimeout(() => {
        $('.kuma-uxform-field input').click();
        setTimeout(() => {
          expect($('.kuma-calendar-picker').css('display')).to.be('block');
          done();
        }, 100);
      }, 100);
    });

    it('single date form field support onClick and onChange event to change value', (done) => {
      ReactDOM.render(createDateField({
        showTime: false,
        format: 'yyyy-MM-dd',
        jsxfrom: '',
        jsxto: '',
        jsxname: 'date',
        jsxlabel: '日期',
        locale: 'zh-cn',
      }), document.getElementById('test-demo'));
      setTimeout(() => {
        $('.kuma-uxform-field input').click();
        setTimeout(() => {
          const $date = $('.kuma-calendar-date').last();
          $date.click();
          setTimeout(() => {
            const $input = $('.kuma-calendar-picker-input .kuma-input');
            // set value is the latest date string
            expect($input.val()).to.be.a('string');
            done();
          }, 100);
        }, 100);
      }, 100);
    });

    it('cascade date form field support onClick and onChange event', (done) => {
      ReactDOM.render(createDateField({
        jsxlabel: 'date2333',
        jsxtype: 'cascade',
      }),
      document.getElementById('test-demo'));
      setTimeout(() => {
        $('.kuma-uxform-field input').click();
        setTimeout(() => {
          const $date = $('.kuma-calendar-date').last();
          $date.click();
          setTimeout(() => {
            const $input = $('.kuma-calendar-picker-input .kuma-input');
            // set value is the latest date string
            expect($input.val()).to.be.a('string');
            done();
          }, 100);
        }, 100);
      }, 100);
    });
  });
});
