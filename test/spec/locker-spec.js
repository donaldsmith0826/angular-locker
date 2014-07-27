describe('angular-locker', function () {

	var provider, locker;

	beforeEach(module('angular-locker', function (lockerProvider) {
		provider = lockerProvider;
		locker = lockerProvider.$get();
	}));

	afterEach(function() {
		// locker.empty();
	});

	describe('lockerProvider', function () {

		it('should be defined', inject(function () {
			expect(provider).toBeDefined();
		}));

		it('should set a default storage driver', inject(function () {
			expect( provider.getStorageDriver() ).toEqual('local');
			provider.setStorageDriver('session');
			expect( provider.getStorageDriver() ).toEqual('session');
		}));

		it('should set a default namespace', inject(function () {
			expect( provider.getNamespace() ).toEqual('locker');
			provider.setNamespace('myApp');
			expect( provider.getNamespace() ).toEqual('myApp');
		}));

	});

	describe('lockerService', function () {

		describe('adding items to locker', function () {

			it('should put a string into the locker', inject(function () {
				var str = 'someVal';
				locker.put('someKey', str);
				expect( locker.get('someKey') ).toEqual(str);
			}));

			it('should put an object into the locker', inject(function () {
				var obj = {
					foo: 'bar',
					bar: 'baz',
					baz: {
						foo: true,
						bar: false,
						baz: 12.34
					}
				};

				locker.put('objectKey', obj);

				var result = locker.get('objectKey');

				expect( result ).toEqual(obj);
				expect( result.baz.bar ).toBeFalsy();
			}));

			it('should put an array into the locker', inject(function () {
				var arr1 = ['foo', 123.456, true, { foo: 'bar' }];
				var arr2 = ['foo', 'bar', 'baz'];

				locker.put('arrayKey1', arr1);
				locker.put('arrayKey2', arr2);

				var result1 = locker.get('arrayKey1');
				var result2 = locker.get('arrayKey2');

				expect( result1 ).toEqual(arr1);
				expect( result2 ).toEqual(arr2);

				expect( result1[3].foo ).toEqual('bar');
				expect( result2[0] ).toEqual('foo');
			}));

			it('should put a key value object into the locker via first param', inject(function () {
				var obj = {
					foo: 'bar',
					bar: 'baz',
					baz: {
						foo: 'baz'
					},
					bob: {
						lorem: true
					}
				};

				locker.put(obj);

				expect( locker.get('foo') ).toEqual('bar');
				expect( locker.get('baz') ).toEqual({ foo: 'baz' });
				expect( locker.get('bob').lorem ).toBeTruthy();
			}));

		});

		describe('removing items from locker', function () {

			it('should remove an item from locker', inject(function () {
				expect( locker.get('someKey') ).toEqual('someVal');

				locker.remove('someKey');

				expect( locker.get('someKey') ).toBeUndefined();
			}));

			it('should remove multiple items from locker by passing an array', inject(function () {
				expect( locker.get('objectKey') ).toBeDefined();
				expect( locker.get('arrayKey1') ).toBeDefined();
				expect( locker.get('foo') ).toBeDefined();

				locker.remove(['objectKey', 'arrayKey1', 'foo']);

				expect( locker.get('objectKey') ).toBeUndefined();
				expect( locker.get('arrayKey1') ).toBeUndefined();
				expect( locker.get('foo') ).toBeUndefined();
			}));

			// it('should remove all items within a namespace', inject(function () {
				// provider.setNamespace('someOtherNamespace');
				// locker.put('keyInOtherNamespace', 'someVal');

				// locker.clean('someOtherNamespace');

				// expect( locker.setNamespace('locker').get('keyInOtherNamespace') ).toBeUndefined();
			// }));

			it('should empty the locker', inject(function () {

				locker.put('anotherKey', { someObj: true, foo: 'barbaz' });

				locker.empty();

				expect( locker.get('anotherKey') ).toBeUndefined();

			}));

		});

		describe('other', function () {

			it('should determine whether an item exists in locker', inject(function () {
				locker.put('randKey', Math.random());

				expect( locker.has('randKey') ).toBeTruthy();
				expect( locker.has('loremipsumdolorsitamet') ).toBeFalsy();
			}));

		});
		
	});

	

});