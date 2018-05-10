window.onload=function(){
	Game.box=$("#box");
	Game.buttons=["简单难度","中等难度","困难难度","洪荒之力"];
	Game.initView();
	
}

var Game={
	//1.初始化界面
	initView:function(){
		//创建一个标签h1
		var title = document.createElement("h1");
		title.innerHTML = "飞机大战";
		this.box.appendChild(title);
		//难度选择按钮
//		var command=["简单难度","中等难度","困难难度","洪荒之力"];
		for(var i=0;i<Game.buttons.length;i++){
			var btn=document.createElement("div");
			btn.className="button";
			btn.innerText=Game.buttons[i];
			this.box.appendChild(btn);
			//点击事件
			(function(rank){
				btn.onclick=function(){
				//清空所有子元素
				Game.box.innerHTML="";
				Game.initSelf();
				Game.initBullet(rank);
				Game.initEnemy(rank);
				console.log(rank);
				
			}
			})(i);
			
		}
		
		
	},
	//2.初始化游戏界面
	//2.1初始化自己
	initSelf:function(){
		//1.贴图
		var plane=new Image();
		plane.src="img/plane.png";
		plane.className="plane";
		plane.id="plane";
		this.box.appendChild(plane);
		//2.给图片绑定鼠标移动
		document.onmousemove=function(event){
			event=event||window.event;
			var planeT=event.pageY-Game.box.offsetTop-10-plane.offsetHeight/2;
			var planeL=event.pageX-Game.box.offsetLeft-10-plane.offsetWidth/2;
			if(planeT<0){
				planeT=0;
			}
			if(planeT>Game.box.offsetHeight-plane.offsetHeight-20){
				planeT=Game.box.offsetHeight-plane.offsetHeight-20;
			}
			if(planeL<0){
				planeL=0;
			}
			if(planeL>Game.box.offsetWidth-plane.offsetWidth-20){
				planeL=Game.box.offsetWidth-plane.offsetWidth-20;
			}
			plane.style.top=planeT+"px";
			plane.style.left=planeL+"px";
		}
	},
	//2.2初始化自己的子弹
	initBullet:function(rank){
		Game.score=0;
		Game.bulletmove=setInterval(function(){
			//生成子弹
			var bullet=new Image();
			bullet.className="bullet";
			bullet.src="img/bullet.png";
			Game.box.appendChild(bullet);
			//生成位置
			bullet.style.top=$("#plane").offsetTop+"px";
			bullet.style.left=$("#plane").offsetLeft+$("#plane").offsetWidth/2+"px";
			
			bullet.movetime=setInterval(function(){
				//子弹上移
				bullet.style.top=bullet.offsetTop-bullet.offsetWidth+"px";
				if(bullet.offsetTop<0){
					//停止计时器
					clearInterval(bullet.movetime);
					//移除子弹
					Game.box.removeChild(bullet);
				}
			},30);
		},600-rank*100);
	},
	//2.3初始化敌人
	initEnemy:function(rank){
		Game.enemymove=setInterval(function(){
			//
			var enemy=new Image();
			enemy.src="img/enemy.png";
			enemy.className="enemy";
			Game.box.appendChild(enemy);
			enemy.style.top=-(Math.random()*100)+"px";
			enemy.style.left=(Math.random()*(Game.box.offsetWidth-20-enemy.offsetWidth))+"px";
			//
			enemy.movetime=setInterval(function(){
				enemy.style.top=enemy.offsetTop+2+"px";
				if(enemy.offsetTop>Game.box.offsetHeight-20){
					//移除
					clearInterval(enemy.movetime);
					Game.box.removeChild(enemy);
				}
			},5);
			
			enemy.hittime=setInterval(function(){
				var bullets=$(".bullet");
				//敌人碰撞
				for(var i=0;i<bullets.length;i++){
					if(Game.isHit(enemy,bullets[i])){
						Game.score += 10;
						//1.移除子弹的计时器
						clearInterval(bullets[i].movetime);
						//2.移除敌人的计时器
						clearInterval(enemy.movetime);
						//3.移除子弹
						Game.box.removeChild(bullets[i]);
						//4.移除碰撞计时器
						clearInterval(enemy.hittime);
						//5.爆炸图
						enemy.src="img/boom.png";
						//6.1秒后移除爆炸图
						setTimeout(function(){
							Game.box.removeChild(enemy);
						},500);
					}
				}
		},20);
		
		//己方碰撞
		var plane=$("#plane");
		enemy.hittime2=setInterval(function(){
			if(Game.isHit(plane,enemy)){
				//移除当前敌人
//				Game.box.removeChild(enemy);
				//1.移除所有子弹的计时器
				var bullets=$(".bullet");
				for (var i = 0; i < bullets.length; i++) {
					clearInterval(bullets[i].movetime);
				}
				//2.移除所有敌人的计时器
				var enemies=$(".enemy");
				for (var i = 0; i < enemies.length; i++) {
					clearInterval(enemies[i].movetime);
				}
				//3.移除碰撞计时器
				clearInterval(enemy.hittime2);
				//移除生成敌人计时器
				clearInterval(Game.enemymove);
				//移除生成子弹计时器
				clearInterval(Game.bulletmove);
				
				//4.爆炸图
				plane.src="img/boom2.png";
				//飞机不能动
				document.onmousemove=false;
				
				//5. 1秒后跳到结束页面
				setTimeout(function(){
					Game.box.innerHTML="";
					Game.initEnd(Game.score);
//							Game.box.removeChild(plane);

				},500);
			}
		},20);
		},800-rank*100);
		
		
	},
	//3.初始化结束界面
	initEnd:function(sum){
		var title = document.createElement("h1");
		title.innerHTML = "得分";
		this.box.appendChild(title);
		
		var score = document.createElement("h1");
		score.innerHTML = sum;
		this.box.appendChild(score);
		
		var btn=document.createElement("div");
		btn.className="button";
		btn.innerText="重新开始";
		this.box.appendChild(btn);
		btn.onclick=function(){
			Game.box.innerHTML="";
			Game.initView();
		}
	},
	//4.碰撞检测
	isHit:function(obj1,obj2){
		l1=obj1.offsetLeft;
		l2=obj2.offsetLeft;
		t1=obj1.offsetTop;
		t2=obj2.offsetTop;
		r1=l1+obj1.offsetWidth;
		r2=l2+obj2.offsetWidth;
		b1=t1+obj1.offsetHeight;
		b2=t2+obj2.offsetHeight;
		if(l1>r2||r1<l2||t1>b2||b1<t2){
			return false;
		}
		return true;
	}
	
}
