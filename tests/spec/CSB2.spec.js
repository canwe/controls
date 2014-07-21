
describe('CSB', function () {

    var getCSB = function () {

        return new ITForms.CSB2();
    };

    it('works', function () {

        var csb = getCSB();

        expect(csb instanceof ITForms.CSB2).toBe(true);

    });

    describe('Conditionals', function () {

        describe('HasFormat', function () {

            it('CreateFormatIfNecessary - format string with value returns true', function () {

                var format =  'test';

                var csb = getCSB();

                expect(csb.CreateFormatIfNecessary(format)).toBe('test');
            });

            it('CreateFormatIfNecessary - empty string returns false', function () {

                var format =  '';

                var csb = getCSB();

                expect(csb.CreateFormatIfNecessary(format, 1)).toBe('{0}');
            });

            it('CreateFormatIfNecessary - bool returns false', function () {

                var format =  true;

                var csb = getCSB();

                expect(csb.CreateFormatIfNecessary(format, 1)).toBe('{0}');
            });

            it('CreateFormatIfNecessary - object returns false', function () {

                var format = {};

                var csb = getCSB();

                expect(csb.CreateFormatIfNecessary(format, 1)).toBe('{0}');
            });

        });

        describe('CreateFormat', function () {

            it('CreateFormat - 1', function () {
                expect(getCSB().CreateFormat(1)).toBe('{0}');
            });

            it('CreateFormat - 2', function () {
                expect(getCSB().CreateFormat(2)).toBe('{0} && {1}');
            });

            it('CreateFormat - 3', function () {
                expect(getCSB().CreateFormat(3)).toBe('{0} && {1} && {2}');
            });

        });
    });

    describe('Trying some csbs', function () {


        it('should work', function () {
           // expect(result).toBe(true);
        });

        it('StringFormat', function () {

            var csb = getCSB();
            var truths = [ true, false, true ];

            var format = '{0} && ( {1} || {2} )';
            var expected = true;
            expect(eval(csb.StringFormat(format, truths))).toBe(expected);

            format = '{0} && {1}';
            expected = false;
            expect(eval(csb.StringFormat(format, truths))).toBe(expected);

            format = '{0} || {1}';
            expected = true;
            expect(eval(csb.StringFormat(format, truths))).toBe(expected);

            format = '{0} && !{1}';
            expected = true;
            expect(eval(csb.StringFormat(format, truths))).toBe(expected);

            format = '{0} && (!{1} && {2})';
            expected = true;
            expect(eval(csb.StringFormat(format, truths))).toBe(expected);

            format = '{0} && (!{1} && {2})';
            expected = true;
            expect(eval(csb.StringFormat(format, truths))).toBe(expected);

        });
    });

    describe('ConditionsMatch', function () {

        it('empty conditions return true', function () {

            var csb = getCSB();
            var result = csb.ConditionsMatch('', []);
            expect(result).toBe(true);
        });

        it('empty format ands together the conditions', function () {

        });


        it('empty condition is match', function () {
            var csb = getCSB();
            var result = csb.ConditionIsMatch();
            expect(result).toBe(true);
        });

        it('undefined is match', function () {
            var csb = getCSB();
            var result = csb.ConditionIsMatch('');
            expect(result).toBe(true);
        });


        it('JavaScript condition works', function () {

            var csb = getCSB();
            var result = csb.ConditionIsMatch({ condition: '1===1' });
            expect(result).toBe(true);
        });


        it('serializing data types', function () {

            var value = true;
            expect(angular.toJson(value, true)).toBe('true');

            value = undefined;
            expect(angular.toJson(value, true)).toBe(undefined);

            value = 'test';
            expect(angular.toJson(value, true)).toBe('"test"');

            value = null;
            expect(angular.toJson(value, true)).toBe('null');

            value = [ true ];
            expect(angular.toJson(value, false)).toBe('[true]');

            value = [ 'test' ];
            expect(angular.toJson(value, false)).toBe('["test"]');

            value = [ 1, 2 ];
            expect(angular.toJson(value, false)).toBe('[1,2]');

            value = [ new Date(2013, 0, 1) ];
            expect(angular.toJson(value, false)).toBe('["2013-01-01T05:00:00.000Z"]');

        });

    });

    describe('Evaluate', function () {

        it('typeof', function () {

            var value = '',
                valuetype = typeof value;

            value = '';
            valuetype = typeof value;
            expect(valuetype).toBe('string');

            value = 1;
            valuetype = typeof value;
            expect(valuetype).toBe('number');

            value = NaN;
            valuetype = typeof value;
            expect(valuetype).toBe('number');

            value = true;
            valuetype = typeof value;
            expect(valuetype).toBe('boolean');

            value = function x() {};
            valuetype = typeof value;
            expect(valuetype).toBe('function');

            value = [];
            valuetype = typeof value;
            expect(valuetype).toBe('object');

            value = {};
            valuetype = typeof value;
            expect(valuetype).toBe('object');

            value = arguments;
            valuetype = typeof value;
            expect(valuetype).toBe('object');

            value = null;
            valuetype = typeof value;
            expect(valuetype).toBe('object');

            value = new Date();
            valuetype = typeof value;
            expect(valuetype).toBe('object');

            value = undefined;
            valuetype = typeof value;
            expect(valuetype).toBe('undefined');

        });

        it('Casting to string', function () {

            function isoDateString(d) {
                function pad(n) { return n < 10 ? '0' + n : n; }
                return d.getUTCFullYear() + '-'
                    + pad(d.getUTCMonth() + 1) + '-'
                    + pad(d.getUTCDate()) + 'T'
                    + pad(d.getUTCHours()) + ':'
                    + pad(d.getUTCMinutes()) + ':'
                    + pad(d.getUTCSeconds()) + 'Z';
            }

            var value = '',
                stringvalue = String(value);

            value = '';
            stringvalue = String(value);
            expect(stringvalue).toBe('');

            value = 'test';
            stringvalue = String(value);
            expect(stringvalue).toBe('test');

            value = 1;
            stringvalue = String(value);
            expect(stringvalue).toBe('1');

            value = NaN;
            stringvalue = String(value);
            expect(stringvalue).toBe('NaN');

            value = true;
            stringvalue = String(value);
            expect(stringvalue).toBe('true');

            value = function x() {};
            stringvalue = String(value);
            expect(stringvalue).toBe('function x() {}');

            value = ['a', 'b'];
            stringvalue = String(value);
            expect(stringvalue).toBe('a,b');

            value = { name: 'a', value: 'b'};
            stringvalue = String(value);
            expect(stringvalue).toBe('[object Object]');
            stringvalue = angular.toJson(value);
            expect(stringvalue).toBe('{"name":"a","value":"b"}');

            value = arguments;
            stringvalue = String(value);
            expect(stringvalue).toBe('[object Arguments]');

            value = null;
            stringvalue = String(value);
            expect(stringvalue).toBe('null');

            value = new Date(2013, 1, 1);
            stringvalue = String(value);
            expect(stringvalue).toBe('Fri Feb 01 2013 00:00:00 GMT-0500 (Eastern Daylight Time)');
            expect(isoDateString(value)).toBe('2013-02-01T05:00:00Z');

            value = undefined;
            stringvalue = String(value);
            expect(stringvalue).toBe('undefined');

        });
    });
});