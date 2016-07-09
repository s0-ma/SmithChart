function CapSeri(z,f,cap){
    var w = 2*math.pi*f
    var ret = math.add(z, math.complex(0, -1/(w*cap)))
    return ret;
}
function CapPara(z,f, cap){
    var w = 2*math.pi*f
    var ret = math.add(z.inverse(), math.complex(0, -1/(w*cap)).inverse()).inverse()
    return ret;
}
function IndSeri(z,f, ind){
    var w = 2*math.pi*f
    var ret = math.add(z, math.complex(0, w*ind))
    return ret;
}
function IndPara(z,f, ind){
    var w = 2*math.pi*f
    var ret = math.add(z.inverse(), math.complex(0, w*ind).inverse()).inverse()
    return ret;
}
function TLSeri(z, z0, theta){
    return ret;
}
function TLParaOpen(z, z0, theta){
    return ret;
}
function TLParaShort(z, z0, theta){
    return ret;
}


