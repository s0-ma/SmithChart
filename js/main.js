var smith;

$(document).ready(function() {
    init()
} );

function init(){
    initSortable()
    initElementTextBox()

    var canvas = document.getElementById('tutorial');

    if (canvas.getContext){
        var canvas = document.getElementById('tutorial');
        if (canvas.getContext){
            var ctx = canvas.getContext('2d');
            smith = new SmithChart(canvas);
            //smith.registerMouseAction()
            smith.registerCursorAction()
            smith.addOptionInterface()

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
        if(type===undefined){
            break;
        }

        var val = $(elements.children[i]).children(".parameter").children("input").val()
        val = val * getUnitFactor($(elements.children[i]).children(".parameter"))

        if(type=="cap_seri"){
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
        if(type===undefined){
            break
        }

        var val = $(elements.children[i]).children(".parameter").children("input").val()
        val = val * getUnitFactor($(elements.children[i]).children(".parameter"))

        //注意 逆算した値を考えるので、演算は逆
        if(type=="cap_seri"){
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

function getUnitFactor(obj){
    var radioBtn = $(obj).children("form").children(".unit").children("input[type='radio']")
    var checkedBtn = radioBtn.filter(":checked")
    return checkedBtn.val()
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
        makeTextBoxControllable(value,update)
    })
    $("#jquery-ui-draggable-connectToSortable .parameter form .unit input[type='radio']").change(function(){
        update()
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
           +'            <input id="" type="text" value="1" />                                                           '
           +'            <br>                                                                                                '
           +'            <form>                                                                                                '
           +'            <div class="unit">                                                                                     '

    if(type=="cap_seri" || type=="cap_para"){
        ret +='                <input type="radio" name="unit" value="1e0" /><label>F</label>                    '
             +'                <input type="radio" name="unit" value="1e-3" /><label>mF</label>                   '
             +'                <input type="radio" name="unit" value="1e-6" /><label>uF</label>                   '
             +'                <input type="radio" name="unit" value="1e-9"/><label>nF</label> '
             +'                <input type="radio" name="unit" value="1e-12" checked="checked" /><label>pF</label> '
    }else if(type=="ind_seri" || type=="ind_para"){
        ret +='                <input type="radio" name="unit" value="1e0" /><label>H</label>                    '
             +'                <input type="radio" name="unit" value="1e-3" /><label>mH</label>                   '
             +'                <input type="radio" name="unit" value="1e-6" /><label>uH</label>                   '
             +'                <input type="radio" name="unit" value="1e-9" checked="checked" /><label>nH</label> '
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

function makeTextBoxControllable(textbox,callback){
        var cb = callback

        $(textbox).unbind()
        $(textbox).keydown(function(e){
            if(e.which==38){
                //up
                var ret = parseFloat($(textbox).val()) * 1.1
            }else if(e.which==40){
                //down
                var ret = parseFloat($(textbox).val()) / 1.1
            }else if(e.which==13){
                //enter
            }else{
                return
            }

            $(textbox).val(ret.toPrecision(3))
            cb()
        })
}
