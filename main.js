var smith;

$( function() {
    initSortable()
    initElementTextBox()
} );

function draw(){
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext){

//        pImp = new Array();
//        pTrack = new Array();
//
//        pImp.push(math.complex(16,30))
//        pTrack.push(ELEMENT["NONE"])
//
//        pImp.push(CapSeri(pImp[0], 1e9, 2.98e-12))
//        pTrack.push(ELEMENT["CAP_SERI"])
//
//        pImp.push(IndPara(pImp[1], 1e9, 5.5e-9))
//        pTrack.push(ELEMENT["IND_PARA"])
//
//        pImp2 = new Array();
//        pTrack2 = new Array();
//
//        pImp2.push(math.complex(16,-30))
//        pTrack2.push(ELEMENT["NONE"])
//
//        pImp2.push(CapSeri(pImp2[0], 1e9, 2.98e-12))
//        pTrack2.push(ELEMENT["CAP_SERI"])

        var canvas = document.getElementById('tutorial');
        if (canvas.getContext){
            var ctx = canvas.getContext('2d');
            smith = new SmithChart(canvas);
            //smith.registerMouseAction()
            smith.registerCursorAction()
            smith.addOptionInterface()
//            smith.points1 = pImp
//            smith.tracks1 = pTrack
//            smith.points2 = pImp2
//            smith.tracks2 = pTrack2

            update()
            smith.redraw()

        }
    }

}

function update(){
    updateSmithChartData()
    smith.redraw()

    updateElementImpedance()
}

var f = 5e9
function updateSmithChartData(){
    pImp1 = new Array();
    pTrack1 = new Array();
    pImp2 = new Array();
    pTrack2 = new Array();

    var elemtents = document.getElementById("elements")

    var source_re = $("#source .parameter .re").val()
    var source_im = $("#source .parameter .im").val()
    pImp1.push(math.complex(source_re,source_im))
    pTrack1.push(ELEMENT["NONE"])

    //source 側
    for(var i = 0; i<elements.children.length; i++){
        var type = $(elements.children[i]).attr("type")
        var val = $(elements.children[i]).children(".parameter").children("input").val()

        if(type===undefined){
            break;
        }else if(type=="cap_seri"){
            pImp1.push(CapSeri(pImp1[pImp1.length-1],f,val))
            pTrack1.push(ELEMENT[(""+type).toUpperCase()])
        }else if(type=="cap_para"){
            pImp1.push(CapPara(pImp1[pImp1.length-1],f,val))
            pTrack1.push(ELEMENT[(""+type).toUpperCase()])
        }else if(type=="ind_seri"){
            pImp1.push(IndSeri(pImp1[pImp1.length-1],f,val))
            pTrack1.push(ELEMENT[(""+type).toUpperCase()])
        }else if(type=="ind_para"){
            pImp1.push(IndPara(pImp1[pImp1.length-1],f,val))
            pTrack1.push(ELEMENT[(""+type).toUpperCase()])
        }
    }

    //load 側
    var load_re = $("#load .parameter .re").val()
    var load_im = $("#load .parameter .im").val()
    pImp2.push(math.complex(load_re,load_im))
    pTrack2.push(ELEMENT["NONE"])

    for(var i = elements.children.length - 1; i>=0; i--){
        var type = $(elements.children[i]).attr("type")
        var val = $(elements.children[i]).children(".parameter").children("input").val()

        //注意 逆算した値を考えるので、演算は逆
        if(type===undefined){
            break
        }else if(type=="cap_seri"){
            pImp2.push(CapSeri(pImp2[pImp2.length-1],-f,val))
            pTrack2.push(ELEMENT[("IND_SERI").toUpperCase()])
        }else if(type=="cap_para"){
            pImp2.push(CapPara(pImp2[pImp2.length-1],-f,val))
            pTrack2.push(ELEMENT[("IND_PARA").toUpperCase()])
        }else if(type=="ind_seri"){
            pImp2.push(IndSeri(pImp2[pImp2.length-1],-f,val))
            pTrack2.push(ELEMENT[("CAP_SERI").toUpperCase()])
        }else if(type=="ind_para"){
            pImp2.push(IndPara(pImp2[pImp2.length-1],-f,val))
            pTrack2.push(ELEMENT[("CAP_PARA").toUpperCase()])
        }
    }

    smith.points1 = pImp1
    smith.tracks1 = pTrack1

    smith.points2 = pImp2
    smith.tracks2 = pTrack2
}

function updateElementImpedance(){

    var elemtents = document.getElementById("elements")

    for(var i = 0; i<elements.children.length; i++){
        var type = $(elements.children[i]).attr("type")

        if(type===undefined){
            break
        }else{
            var re = smith.points1[i+1].re.toPrecision(3)
            var im = smith.points1[i+1].im.toPrecision(3)
            $(elements.children[i]).children(".impedance").children(".re").text(re)
            $(elements.children[i]).children(".impedance").children(".im").text(im)
        }
    }

    for(var i = 0; i<elements.children.length; i++){
        var type = $(elements.children[elements.children.length - i-1]).attr("type")

        if(type===undefined){
            break
        }else{
            var re = smith.points2[i+1].re.toPrecision(3)
            var im = smith.points2[i+1].im.toPrecision(3)
            $(elements.children[elements.children.length -i-1]).children(".impedance").children(".re").text(re)
            $(elements.children[elements.children.length -i-1]).children(".impedance").children(".im").text(im)
        }
    }
}


function initSortable(){
    $( '.jquery-ui-sortable' ) . sortable( {
            revert: true,
            receive: function(event,ui){
                //追加時
                var inserted = $(event.target).children(".new-element")
                inserted.removeClass("new-element")
                var type = inserted.attr("type")

                onElementItemAdded(inserted,type)
                update();
            },
            update: function(event,ui){
                //入れ替え時
                update();
            },
            cancel: ".fixed",
            handle: ".icon"
    } );
    $( '#jquery-ui-draggable li' ) . draggable( {
        connectToSortable: '.jquery-ui-sortable',
        helper: 'clone',
        revert: 'invalid',
    } );
}

function initElementTextBox(){
    $("#jquery-ui-draggable-connectToSortable .parameter input").each(function(index,value){
        $(value).unbind()
        $(value).keydown(function(e){
            if(e.which==38){
                //up
                $(value).val(parseFloat($(value).val()) * 1.1)
            }else if(e.which==40){
                //down
                $(value).val(parseFloat($(value).val()) / 1.1)
            }else if(e.which==13){
                //enter
            }
            update()
        })
    })
}

function onElementItemAdded(obj, type){

    obj.removeClass("ui-state-highlight")
    obj.attr("style","")
    obj.empty()

    obj.addClass("ui-state-default")

    var ret = ''
             +'       <div class="icon">                                                                                   '
             +'           <span class="ui-icon ui-icon-arrowthick-2-n-s ui-corner-all ui-state-hover"></span>              '
             +'       </div>                                                                                               '
             +'       <div class="img">                                                                                   '

    if(type=="cap_seri"){
        ret += '        <img src="./img/C.jpg" width*"100px" height="60px">                                                     '
    }else if(type=="cap_para"){
        ret += '        <img src="./img/ShuntC.jpg" width*"100px" height="60px">                                                     '
    }else if(type=="ind_seri"){
        ret += '        <img src="./img/L.jpg" width*"100px" height="60px">                                                     '
    }else if(type=="ind_para"){
        ret += '        <img src="./img/ShuntL.jpg" width*"100px" height="60px">                                                     '
    }

    ret +=  '    </div>                                                                                                      '
           +'    <div class="parameter">                                                                                     '
           +'            <input id="" type="text" value="0.4e-11" />                                                           '
           +'            <br>                                                                                                '
           +'            <form>                                                                                                '
           +'            <div id="unit">                                                                                     '

    if(type=="cap_seri" || type=="cap_para"){
        ret +='                <input type="radio" id="radio1" name="radio" /><label for="radio1">F</label>                    '
             +'                <input type="radio" id="radio2" name="radio" /><label for="radio2">mF</label>                   '
             +'                <input type="radio" id="radio3" name="radio" /><label for="radio3">uF</label>                   '
             +'                <input type="radio" id="radio4" name="radio" checked="checked" /><label for="radio4">nF</label> '
    }else if(type=="ind_seri" || type=="ind_para"){
        ret +='                <input type="radio" id="radio1" name="radio" /><label for="radio1">H</label>                    '
             +'                <input type="radio" id="radio2" name="radio" /><label for="radio2">mH</label>                   '
             +'                <input type="radio" id="radio3" name="radio" /><label for="radio3">uH</label>                   '
             +'                <input type="radio" id="radio4" name="radio" checked="checked" /><label for="radio4">nH</label> '
    }

    ret +=  '            </div>                                                                                              '
           +'            </form>                                                                                                '
           +'    </div>                                                                                                      '
           +'    <div class="impedance">                                                                 '
           +'        <span class="re">0</span> + i                                                             '
           +'        <span class="im">0</span>                                                              '
           +'    </div>                                                                                                      '
           +'    <button>x</button>                                                                                          '

    obj.append(ret)

    //closeButton
    $(obj).children("button").click(function(){
        obj.remove()
        update()
    })

    //
    initElementTextBox()
}

