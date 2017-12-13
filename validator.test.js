const expect = require('expect');

const {validate} = require('./validator');

it('should validate', () => {
  var res = validate({}, {});
  
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});