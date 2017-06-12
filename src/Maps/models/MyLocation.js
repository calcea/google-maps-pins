/**
 * Created by george on 7/21/2016.
 */

var MyLocation = Backbone.Model.extend({
    getMyLocation: function (successCallback, errorCallback) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
});