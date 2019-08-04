(function () {
    //the text title
    var mouseX, mouseY;
    var ww = $( window ).width();
    var wh = $( window ).height();
    var traX, traY;
    $(document).mousemove(function(e){
      mouseX = e.pageX;
      mouseY = e.pageY;
      traX = ((4 * mouseX) / 570) + 40;
      traY = ((4 * mouseY) / 570) + 50;
      console.log(traX);
      $(".title").css({"background-position": traX + "%" + traY + "%"});
    });

    //start of the countries code
    var $textInput = null;
    var $Selection = null;

    /** constructor init. **/
    var init = function () {
        $('#ctr').html(`
<div>
<br>
<br>
<h3 class="title">Countries</h3><br>
    <input class="inputText" type="text" placeholder="Enter country name">
    <input class="inputText2" type="text" placeholder="Enter country capital">
    <br>
    <button class="btnFilter btn btn-default">Filter by Name</button>
    <button class="btnFilter2 btn btn-default">Filter by Capital</button>
    <button class="btnAll btn btn-default">All</button>
</div>
<p class="col-md-12 totalCountries"></p>
<div class="col-md-12 centered"> 
    <div class="form-inline"> 
     <select class="form-control countriesSelection">
            <option>Select Country</option>
     </select>
        <button class="btnShow btn btn-default">Show</button>
    </div>
</div>
<div class="col-md-12 bottomCtr"> 
</div>
<p>By Shai Shalev. 2018</p>
        `);
        $textInput = $('.inputText');
        $textInput2 = $('.inputText2');
        $Selection = $('.countriesSelection');
        getAllCountries();

        //event button All
        $('.btnAll').on('click', function () {
            debugger;
            //console.log('btnAll');
            cleanInput();
            getAllCountries();
            cleanBottomCtr();
        });

        //event button filter
        $('.btnFilter').on('click', function () {
            //console.log('btnFilter');

            if($textInput.val() != ''){
               filterCountries($textInput.val());
            }
            if($textInput2.val() != ''){
                filterCountries2($textInput2.val());
            }
        });
                //event button filter
        $('.btnFilter2').on('click', function () {
            if($textInput2.val() != ''){
                filterCountries2($textInput2.val());
            }
        });

        //event button Show
        $('.btnShow').on('click', function () {
            //console.log('btnShow');
            if($Selection.val() !='Select Country'){
                var countryNameSelected = '';
                $( "select option:selected" ).each(function() {
                    countryNameSelected = $(this).text();
                });
                getCountryByName(countryNameSelected,false);
            }
        });
    };

    /**
     *  add all countries from API to selection.
     */
    var getAllCountries = function () {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/all',
            method: 'get',
            dataType: 'json'
        }).done(function (ret) {
            //console.log(ret.length);
            //reset Selection
           // $Selection = null;
            hideShowSelectionWithButton(false);
            $.each(ret, function (index, value) {
                $('<option>').val(value.name).text(value.name).appendTo($Selection);
            });
            totalCountries(ret.length);
        }).fail(function (msg) {
            console.log('error:', msg)
        });
    };

    /**
     * dump country by name and if filter set true change API url,
     * for show 1 country was finded and hide selection with button show.
     * @param name
     * @param filter
     */
    var getCountryByName = function (name,filter)
    {
        var url = null;
        if(filter){
           url = 'https://restcountries.eu/rest/v2/name/'+name;
        }else{
            url = 'https://restcountries.eu/rest/v2/name/'+name+'?fullText=true';
        }
        $.ajax({
            url: url,
            method: 'get',
            dataType: 'json'
        }).done(function (ret) {
            $container = $('.bottomCtr');
            $currencies = ret[0].currencies; 
            //console.log(ret);
            $container.empty();
            $container.append(`<img src="${ret[0].flag}">`);
            $container.append(`<p>Name: ${ret[0].name}</p>`);

            if(ret[0].topLevelDomain.length > 1)
            {
                var st = [];
                for(var i = 0; i < ret[0].topLevelDomain.length; i++ ){
                    st.push(ret[0].topLevelDomain[i]);
                }
                $container.append(`<p>Top Level Domain: ${st.join(',')}</p>`);
            }else{
                $container.append(`<p>Top Level Domain: ${ret[0].topLevelDomain[0]}</p>`);
            }

            $container.append(`<p>Capital: ${ret[0].capital}</p>`);
            $container.append(`<p>Currencies:</p>`);

            for(var i = 0; i < $currencies.length; i++){
                //console.log($currencies[i].code);
                $container.append(`<div class="klum"></div>`);
                if($currencies.code != null || $currencies.code != ''){
                    $container.append(`<p>${$currencies[i].code}</p>`);
                    //console.log($currencies[i].code);
                }
                if($currencies.name != null || $currencies.name != ''){
                    $container.append(`<p>${$currencies[i].name}</p>`);
                    //console.log($currencies[i].name);
                }
                if($currencies.symbol != null || $currencies.symbol != ''){
                    $container.append(`<p>${$currencies[i].symbol}</p>`);
                    //console.log($currencies[i].symbol);
                }
                $container.append(`<div class="klum"></div>`);
            }

        }).fail(function (msg) {
            console.log('error:', msg)
        });
    };


    //for the capital filter
    var getCountryByCapital = function (capital,filter)
    {
        var url = null;
        if(filter){
           url = 'https://restcountries.eu/rest/v2/capital/'+capital;
        }else{
            url = 'https://restcountries.eu/rest/v2/capital/'+capital+'?fullText=true';
        }
        $.ajax({
            url: url,
            method: 'get',
            dataType: 'json'
        }).done(function (ret) {
            $container = $('.bottomCtr');
            $currencies = ret[0].currencies; 
            //console.log(ret);
            $container.empty();
            $container.append(`<img src="${ret[0].flag}">`);
            $container.append(`<p>Name: ${ret[0].name}</p>`);

            if(ret[0].topLevelDomain.length > 1)
            {
                var st = [];
                for(var i = 0; i < ret[0].topLevelDomain.length; i++ ){
                    st.push(ret[0].topLevelDomain[i]);
                }
                $container.append(`<p>Top Level Domain: ${st.join(',')}</p>`);
            }else{
                $container.append(`<p>Top Level Domain: ${ret[0].topLevelDomain[0]}</p>`);
            }

            $container.append(`<p>Capital: ${ret[0].capital}</p>`);
            $container.append(`<p>Currencies:</p>`);

            for(var i = 0; i < $currencies.length; i++){
                //console.log($currencies[i].code);
                $container.append(`<div class="klum"></div>`);
                if($currencies.code != null || $currencies.code != ''){
                    $container.append(`<p>${$currencies[i].code}</p>`);
                    //console.log($currencies[i].code);
                }
                if($currencies.name != null || $currencies.name != ''){
                    $container.append(`<p>${$currencies[i].name}</p>`);
                    //console.log($currencies[i].name);
                }
                if($currencies.symbol != null || $currencies.symbol != ''){
                    $container.append(`<p>${$currencies[i].symbol}</p>`);
                    //console.log($currencies[i].symbol);
                }
                $container.append(`<div class="klum"></div>`);
            }

        }).fail(function (msg) {
            console.log('error:', msg)
        });
    };

    /**
     * get name of country from API and to dump it.
     * @param name
     */
    var filterCountries = function (name) {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/name/'+name,
            method: 'get',
            dataType: 'json'
        }).done(function (ret) {
            //console.log(name);
            cleanSelection();
            if(ret.length == 1){
                getCountryByName(name,true);
                hideShowSelectionWithButton(true);
            }else {
                hideShowSelectionWithButton(false);
                $.each(ret, function (index, value) {
                    $('<option>').val(value.name).text(value.name).appendTo($Selection);
                });
                cleanBottomCtr();
            }
            totalCountries(ret.length);
        }).fail(function (msg) {
            console.log('error:', msg);
            cleanBottomCtr();
            totalCountries('0');
            hideShowSelectionWithButton(true);
        });
    };

    /**
     * get capital of country from API and to dump it.
     * @param capital
     */
    var filterCountries2 = function (capital) {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/capital/'+capital,
            method: 'get',
            dataType: 'json'
        }).done(function (ret) {
            //console.log(name);
            cleanSelection();
            if(ret.length == 1){
                getCountryByCapital(capital,true);
                hideShowSelectionWithButton(true);
            }else {
                hideShowSelectionWithButton(false);
                $.each(ret, function (index, value) {
                    $('<option>').val(value.capital).text(value.capital).appendTo($Selection);
                });
                cleanBottomCtr();
            }
            totalCountries(ret.length);
        }).fail(function (msg) {
            console.log('error:', msg);
            cleanBottomCtr();
            totalCountries('0');
            hideShowSelectionWithButton(true);
        });
    };

    /**
     * function hide or show container with selection and button show,
     * if parameter true hide, else show.
     * @param action
     */
    var hideShowSelectionWithButton = function (action) {
        if(action){
            $('.centered').hide();
        }else{
            $('.centered').show();
        }
    };

    /**
     * get number of countries and dump it.
     * @param count
     */
    var totalCountries = function(count){
        $('.totalCountries').text(`Total ${count} countries in selection`);
    };
    /**
     * clean all options in selection.
     */
    var cleanSelection = function(){
        $Selection.find('option').remove().end()
    };
    /**
     * clean bottom container of  countries info.
     */
    var cleanBottomCtr = function(){
        $('.bottomCtr').html('');
    };
    var cleanInput = function() {
        $('input:text').focus(
        function(){
            $(this).val('');
        })};
    init();
})();
