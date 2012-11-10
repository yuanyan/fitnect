define(function () {

    function change(){
        var activeTab = $(".cabinet .tab .active");
        activeTab.removeClass('active');
        activeTab.siblings().addClass('active');

    }

    return {change: change};
});