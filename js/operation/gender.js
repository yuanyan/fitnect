define(function (require) {

    var M = require("../voice");

    var gender = 1;

    function change(){

        gender = (gender == 1 ? 2 : 1);

        var activeTab = $(".cabinet .tab .active");
        activeTab.removeClass('active');
        activeTab.siblings().addClass('active');

        M.gotoType(gender);

    }

    return {change: change};
});