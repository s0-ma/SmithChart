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
function TlSeri(z, z0, theta){
    var a = z.add(z0.mul(math.tan(theta/180.*math.pi)).mul(math.complex(0,1)))
    var b = z0.add(z.mul(math.tan(theta/180.*math.pi)).mul(math.complex(0,1)))
    var ret = math.complex(z0).mul(a).mul(b.inverse())
    return ret;
}
function TlParaOpen(z, z0, theta){
    var a = math.complex(0,-1).mul(z0).mul(math.cot(theta/180.*math.pi))
    var ret = math.add(z.inverse(), a.inverse()).inverse()
    return ret;
}
function TlParaShort(z, z0, theta){
    var a = math.complex(0,1).mul(z0).mul(math.tan(theta/180.*math.pi))
    var ret = math.add(z.inverse(), a.inverse()).inverse()
    return ret;
}


