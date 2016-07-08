var ELEMENT = {
    NONE:           0,
    C_CLOCKWISE:    1,
    CLOCKWISE:      2,

    CAP_SERI:       1,
    CAP_PARA:       2,
    IND_SERI:       2,
    IND_PARA:       1,
    TL_SERI:        1,
    TL_PARA_OPEN:   1,
    TL_PARA_SHORT:  1
}

function SmithChart(canvas){
    var self = this

    self.canvas = canvas
    self.ctx = canvas.getContext("2d");

    self.name = "Smith chart drawing library"
    self.version = "0.0.1"

    //displaySetting
    self.chart_r = 200
    self.center_x = 250
    self.center_y = 250

    //setting
    self.showQ = false;
    self.showImpedanceChart = true;
    self.showAdmittanceChart = true;
    self.showQualityFactor = false;
    self.showTrack = true;

    self.Z0 = 50
    self.tics_re = [12.5, 25, 50, 100, 200]
    self.tics_im = [12.5, 25, 50, 100, 200]
    self.tics_q = [1,2,5,10]

    //drawnObj
    self.points1 = []
    self.tracks1 = []

    self.points2 = []
    self.tracks2 = []

    self.impToCart = function(r,i){
        var z = math.complex(r,i)
        var _z = z.mul(1/self.Z0);
        var ret = math.add(_z, -1).mul( math.add(_z, 1).inverse());
        return ret;
    }

    self.cartToWin = function(z){
        var x = z.re  *self.chart_r + self.center_x
        var y = -z.im *self.chart_r + self.center_y
        return [x,y]
    }

    self.winToCart = function(x,y){
        var ret = math.complex((x-self.center_x)/(self.chart_r), (y-self.center_y)/(-self.chart_r))
        return ret;
    }

    self.cartToImp = function(_z){
        var ret = math.add(_z, +1).mul( math.add(_z, -1).inverse());
        var z = ret.mul(-self.Z0);
        return z;
    }

    self.drawSmithChart = function(){
        self.ctx.beginPath();
        self.ctx.arc(self.center_x, self.center_y, self.chart_r, 0, Math.PI*2, false);
        self.ctx.stroke();

        self.ctx.beginPath();
        tmp = self.cartToWin(math.complex(-1,0))
        self.ctx.moveTo(tmp[0],tmp[1]);
        tmp = self.cartToWin(math.complex(1,0))
        self.ctx.lineTo(tmp[0],tmp[1]);
        self.ctx.stroke();

        if(self.showImpedanceChart){
            self.ctx.lineWidth = .3

            self.tics_re.forEach(function(value){
                r = self.cartToWin(math.complex(1,0))[0]
                l = self.cartToWin(self.impToCart(value,0))[0]
                y = self.cartToWin(self.impToCart(0,0))[1]
                self.ctx.beginPath();
                self.ctx.arc((r+l)/2, y, (r-l)/2, 0, Math.PI*2, false);
                self.ctx.stroke();
            })

            self.tics_im.forEach(function(value){
                z = self.impToCart(0,value)
                phi = z.toPolar().phi
                center = self.cartToWin(math.complex(1, math.tan(phi/2)))
                r = self.cartToWin(math.complex(1, 0))[1] - center[1]

                self.ctx.beginPath();
                self.ctx.arc(center[0], center[1], r, Math.PI/2, Math.PI/2+(Math.PI-phi), false);
                self.ctx.stroke();

                z = self.impToCart(0,-value)
                phi = z.toPolar().phi
                center = self.cartToWin(math.complex(1, math.tan(phi/2)))
                r = - self.cartToWin(math.complex(1, 0))[1] + center[1]

                self.ctx.beginPath();
                self.ctx.arc(center[0], center[1], r, -Math.PI/2, Math.PI/2-(phi), true);
                self.ctx.stroke();
            });

            self.ctx.lineWidth = 1
        }

        if(self.showAdmittanceChart){
            self.ctx.lineWidth = .3

            self.tics_re.forEach(function(value){
                l = self.cartToWin(math.complex(-1,0))[0]
                r = self.cartToWin(self.impToCart(value,0))[0]
                y = self.cartToWin(self.impToCart(0,0))[1]
                self.ctx.beginPath();
                self.ctx.arc((r+l)/2, y, (r-l)/2, 0, Math.PI*2, false);
                self.ctx.stroke();
            })

            self.tics_im.forEach(function(value){
                z = self.impToCart(0,value)
                phi = z.toPolar().phi
                center = self.cartToWin(math.complex(-1, math.tan(phi/2)))
                r = self.cartToWin(math.complex(1, 0))[1] - center[1]

                self.ctx.beginPath();
                self.ctx.arc(center[0], center[1], r, Math.PI/2, Math.PI/2-(Math.PI-phi), true);
                self.ctx.stroke();

                z = self.impToCart(0,-value)
                phi = z.toPolar().phi
                center = self.cartToWin(math.complex(-1, math.tan(phi/2)))
                r = - self.cartToWin(math.complex(1, 0))[1] + center[1]

                self.ctx.beginPath();
                self.ctx.arc(center[0], center[1], r, -Math.PI/2, Math.PI/2+(phi), false);
                self.ctx.stroke();
            });

            self.ctx.lineWidth = 1
        }

        if(self.showQualityFactor){
            self.ctx.lineWidth = .3

            self.tics_q.forEach(function(value){
                x = self.cartToWin(math.complex(0,-1/value))[0]
                y = self.cartToWin(math.complex(0,-1/value))[1]
                tmp = self.cartToWin(math.complex(-1,0))
                r = math.sqrt(math.pow(tmp[0]-x,2) + math.pow(tmp[1]-y, 2))
                phi = math.atan(value)
                console.log(x,y,r)
                self.ctx.beginPath();
                self.ctx.arc(x, y, r, -(Math.PI/2 - phi), -(Math.PI/2+phi), true);

                x = self.cartToWin(math.complex(0,1/value))[0]
                y = self.cartToWin(math.complex(0,1/value))[1]
                self.ctx.arc(x, y, r, (Math.PI/2 - phi), (Math.PI/2+phi), false);
                self.ctx.stroke();
            })

            self.ctx.lineWidth = 1
        }

    }

    self.redraw = function(){
        var tl_x = self.center_x-self.chart_r
        var tl_y = self.center_y-self.chart_r
        var w = self.chart_r*2
        var h = self.chart_r*2
        self.ctx.clearRect(tl_x, tl_y, w, h)
        self.ctx.clearRect(0,0, self.canvas.width, self.canvas.height)
        self.drawSmithChart()

        self.points1.forEach(function(value,index, obj){
            self.plotPoint(value)

            if(self.showTrack){
                if(self.tracks1[index] == ELEMENT["C_CLOCKWISE"]){
                    self.plotTrack(obj[index-1], obj[index], true)
                }else if(self.tracks1[index] == ELEMENT["CLOCKWISE"]){
                    self.plotTrack(obj[index-1], obj[index], false)
                }
            }
        })
        self.points2.forEach(function(value,index, obj){
            self.plotPoint(value)

            if(self.showTrack){
                if(self.tracks2[index] == ELEMENT["C_CLOCKWISE"]){
                    self.plotTrack(obj[index-1], obj[index], true)
                }else if(self.tracks2[index] == ELEMENT["CLOCKWISE"]){
                    self.plotTrack(obj[index-1], obj[index], false)
                }
            }
        })
    }

    self.plotPoint = function(z){
        x = self.cartToWin(self.impToCart(z.re,z.im))[0]
        y = self.cartToWin(self.impToCart(z.re,z.im))[1]
        self.ctx.beginPath();
        self.ctx.arc(x, y, 5,0,Math.PI*2.0,true);
        self.ctx.fill();
    }

    self.plotTrack = function(z1, z2, direction){
        zn1 = self.impToCart(z1.re,z1.im)
        zn2 = self.impToCart(z2.re,z2.im)

        var xn = ((zn1.im+zn2.im)/2) * (zn2.im-zn1.im)/(zn2.re-zn1.re) + (zn1.re+zn2.re)/2

        var center_xy = self.cartToWin(math.complex(xn, 0))
        var zn1_xy = self.cartToWin(zn1)
        var r = math.sqrt(math.pow(zn1_xy[0]-center_xy[0], 2) + math.pow(zn1_xy[1]-center_xy[1], 2))

        var phi1 = math.add(zn1, math.complex(-xn,0)).toPolar().phi
        var phi2 = math.add(zn2, math.complex(-xn,0)).toPolar().phi

        self.ctx.beginPath();
        self.ctx.arc(center_xy[0], center_xy[1], r ,-phi1 ,-phi2, direction);
        self.ctx.stroke();
    }

    self.registerCursorAction = function(){
        function onMousemove(e) {
            var rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;

            z = self.cartToImp(self.winToCart(x,y))
            self.points1[i_drag] = z
            self.points2[i_drag] = z

            self.redraw()
        }

        function showMousePosition(e){
            var rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;

            z = self.cartToImp(self.winToCart(x,y))

            self.ctx.font = "16pt Arial";
            self.ctx.textAlign = "center";
            self.ctx.clearRect( 300, 480, 500, 500);
            self.ctx.fillText(""+z.re.toPrecision(3)+" "+ z.im.toPrecision(3), 400 , 500)
        }

        self.canvas.addEventListener('mousemove', showMousePosition, false);
    }

    self.registerMouseAction = function() {
        var i_drag;

        function onMousedown(e) {
            var rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;

            self.points1.forEach(function(z,index){
                px = self.cartToWin(self.impToCart(z.re,z.im))[0]
                py = self.cartToWin(self.impToCart(z.re,z.im))[1]
                if((px-x)*(px-x)+(py-y)*(py-y) < 10*10){
                    //drawImp(ctx, value)
                    i_drag = index
                    self.canvas.addEventListener('mousemove', onMousemove, false);
                    self.canvas.addEventListener('mouseup', onMouseup, false);
                }
            })
            self.points2.forEach(function(z,index){
                px = self.cartToWin(self.impToCart(z.re,z.im))[0]
                py = self.cartToWin(self.impToCart(z.re,z.im))[1]
                if((px-x)*(px-x)+(py-y)*(py-y) < 10*10){
                    //drawImp(ctx, value)
                    i_drag = index
                    self.canvas.addEventListener('mousemove', onMousemove, false);
                    self.canvas.addEventListener('mouseup', onMouseup, false);
                }
            })
        }

        function onMouseup(e) {
            self.canvas.removeEventListener('mousemove', onMousemove, false);
            self.canvas.removeEventListener('mouseup', onMouseup, false);
        }

        /* canvas要素に対してイベントを設定 */
        self.canvas.addEventListener('mousedown', onMousedown, false);
    }

    self.addOptionInterface = function() {
        //$(self.canvas).after(""
        //    + '<div class="EditArea" id="editarea"> '
        //    + '<input class="editbox" type="text">  '
        //    + '</div>                               '
        //)

        //$(self.canvas).after(""
        //    + '<div class="EditArea" id="editarea"> '
        //    + '<input class="editbox" type="text">  '
        //    + '</div>                               '
        //)
    }
}



