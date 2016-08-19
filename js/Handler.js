	$(document).on("pageshow","#add_budget",function(){
	var monthNames = ["January", "February", "March", "April", "May", "June",
					  "July", "August", "September", "October", "November", "December"];
	var d = new Date();
	document.getElementById('month').innerHTML =  monthNames[d.getMonth()];
	});
//-------------------------------------- END -----------------------------------------------------------------//	

//------------------------------------------CHECK MONTHLY BUDGET IF NAA -----------------------------------------------//
	$(document).on("pagebeforeshow","#homepage",function(){ // CHECK FOR MONTHYL BUDGET..
        var AB = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        AB.transaction(Check, errorCB);
	});
	function Check(tx) {
		// alert('success in the first function!');
        tx.executeSql('SELECT * FROM User', [], Check2, errorCB);
    }
	function Check2(tx, results) {
		// alert('success in the second function!');
		var User = results.rows.item(0).name; // .name meaning and ngalan sa column, pasabot sa (0).name = and pinaka first na value sa name na column
		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];
		var d = new Date(); // and Date() kay object, so nag create ta og bag.ong instance sa Date() ang value kay d.
		var current_month = monthNames[d.getMonth()]; // getMonth() kay mu return og value gkan 0 - 11.
		var year = d.getFullYear(); // get.FullYear() gkuha nato ang year karon..
		document.getElementById('todaymonth').innerHTML = current_month; // atong gi output ang current month sa homepage.html...
		
        xmlhttp = new XMLHttpRequest(); // make new XMLHttpRequest ang ngalan kay xmlhttp.
        xmlhttp.onreadystatechange = function() 
		{
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				var Response = xmlhttp.responseText; // xmlhttp.responseText VALUE NA GKAN NI SIYA PERMI SA ONLINE DATABASE...
				if(Response == 1)
				{
					alert('The app has detected that you haven\'t provided a budget for today\'s month');
					window.location.href = 'AddBudget.html';
				}
				else{} // Response == 2....
            }
        }
		var params = "User="+User+ " &Month=" +current_month+ "&Year=" +year;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/test.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
		}

//----------------------------------------END OF TESTING -----------------------------------------------------//	

//------------------------------------- SWITCH CASE FOR LOGIN AND NETWORK INFORMATION ------------------------//
	function Login() 
	{
			switch(checkconnection())
			{
				case 'false': 
						alert('You need to connect to the internet!');
				break;
				
				case 'LoginProcess':
						LoginProcess();
				
			default:
			}
	}
//--------------------------------------END OF SWITCH CASE ----------------------------------------------//	

//--------------------------------------CHECK CONNECTION HERE -------------------------------------------//
	function checkconnection()
	{
		var networkState = navigator.connection.type;
		if(networkState == Connection.WIFI | networkState == Connection.CELL_4G | networkState == Connection.CELL_3G | networkState == Connection.CELL_2G)
		{
			return 'LoginProcess';
		}
		else
		{
			return 'false';
		}
	}
//------------------------------------------END OF CHECKING OF CONNECTION -------------------------------------//

//------------------------------------------ACTUAL LOGIN PROCESS ----------------------------------------------//	
	function LoginProcess()
	{
		var LoginUsername = document.getElementById('LoginUsername').value;
		var LoginPassword = document.getElementById('LoginPassword').value;
		if (LoginUsername == '' && LoginPassword == '')
		{
			alert('You need to enter your Username and Password!');
		}
		else
		{
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					var Response = xmlhttp.responseText +"";
					if(Response == 1)
					{
						var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
						db.transaction(inputusername, errorCB);
						alert( 'Login Sucessful!!');
						window.location.href = 'homepage.html'; // window.location.href == redirect user to homepage.html
					}
					else{alert(Response);}
				}
			}
			var params = "Username="+LoginUsername+ " &Password=" +LoginPassword;
			//POST FOR UNLIMITED DATA SENDING FROM AJAX REQUEST.
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/User.php",true); // asynchronous ang ajax request basta 'true'
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
	}
	function inputusername(fa) {
		var Usernametwo = document.getElementById('LoginUsername').value;
		fa.executeSql('DROP TABLE IF EXISTS User');
        fa.executeSql('CREATE TABLE IF NOT EXISTS User (name TEXT)'); // Table name = User, column name = name, type = TEXT.
		fa.executeSql("INSERT INTO User (name) VALUES (?)",[Usernametwo]);
    }
//---------------------------------------------------END OF LOGIN PROCESS ---------------------------------------------//

//---------------------------------------------------REGISTER PROCESS -------------------------------------------------//
	function Register(){
		var first = document.getElementById('first').value;
		var second = document.getElementById('second').value;
		if(first == '' || second == ''){alert('All fields are required');} // CHECK KUNG EMPTY AND FIRST OG SECOND
		else if(first.length && second.length < 5){alert('User name and Pass must be atleast 5 characters long');} // CHECK KUNG DLI LESS THAN 5 ANG LENGTH..
		else{ // SAKTO TANAN..
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					var Response = xmlhttp.responseText +"";
					if(Response == 'false')
					{
						alert( 'Username: ' + first + ' is already taken!');
					}
					else{ //Response == 'true'
						alert('Register successful!'); 
						window.location.href = 'index.html';
					}
				}
			}
			
			var params = "Username="+first+ " &Password=" +second;
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/register.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
	}
//-------------------------------------------------END OF REGISTER PROCESS ------------------------------------//

//-------------------------------------------------PIE CHART DISPLAY ------------------------------------------//
	function openDB()
	{
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		db.transaction(openQuery, errorCB);	
	}
	function openQuery(tx) {
        tx.executeSql('SELECT * FROM User', [], displaypiechart, errorCB);
    }
	function displaypiechart(tx, results){
		var User = results.rows.item(0).name;
		var monthNames = ["January", "February", "March", "April", "May", "June",
					  "July", "August", "September", "October", "November", "December"];
		var f = new Date();
		var todaymonth = monthNames[f.getMonth()];
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() 
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				//alert(xmlhttp.responseText);
				var myArr = JSON.parse(xmlhttp.responseText);
				// alert(myArr.length);
				var total = parseInt(myArr[0].Total) - 1;
				var optionsPie = {
					responsive: true,
					tooltipEvents: [],
					showTooltips: true,
					segmentShowStroke: true,
					animation: true
				}
				var ctx = document.getElementById("myChart").getContext("2d");
				var myChart = new Chart(ctx).Pie(myArr, optionsPie);
				var tr="<tr><th>Color</th><th>Category</th><th>Total</th><th>Percentage</th></tr>";
			   $("#table").append(tr);
				for(var i=0;i<myArr.length;i++)
				{
					var td1="<tr><td bgcolor="+myArr[i].color+"></td>";
					var td2="<td>"+myArr[i].label+"</td>";
					var td3="<td>"+myArr[i].Totalperlabel+"</td>";
					var td4="<td>"+Math.round(myArr[i].Totalperlabel / total * 100)+"%</td></tr>";
					$("#table").append(td1+td2+td3+td4);
				} 
				var td4="<tr><td>Total</td><td></td><td>"+myArr[0].Total+"</td><td>100%</td></tr>";
			   $("#table").append(td4); 				

			}
		}
		var params = "User="+User+ " &Month=" +todaymonth;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/piechartdata.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
    }
//-------------------------------------------------END OF PIE CHART DISPLAY -----------------------------------//

//-------------------------------------------------DYNAMIC CATEGORIES WITH DATABASE --------------------------//
	function categories() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(categorysuccess, errorCB);
    }
	function categorysuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], categorysuccess2, errorCB);
    }
	function categorysuccess2(tx, results) {
		var User = results.rows.item(0).name;
		var monthNames = ["January", "February", "March", "April", "May", "June",
					  "July", "August", "September", "October", "November", "December"];
		var f = new Date();
		var monthkaron = monthNames[f.getMonth()];
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
		{
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				$('ul#category').append(xmlhttp.responseText).listview('refresh');
				//PASABOT SA DOLLAR SIGN KAY 'SELECT'...
				// .append meaning atong sumpayan og value sulod sa .append()..
				//.listview('refresh') pra i refresh ang html sa JQUERY MOBILE
            }
        }
		var params = "User="+User+ " &Month=" +monthkaron;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/Category.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
		}
//-------------------------------------------------END OF DYNAMIC CATEGORY WITH DATABASE --------------------------------//

//----------------------------- -------------------DYNAMIC CATEGORY INFORMATION WITH DATABASE --------------------//
	$(document).on("pagebeforeshow","#catinfo",function(){
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(catinformation, errorCB); 
	});
	function catinformation(tx) {
        tx.executeSql('SELECT * FROM User', [], catinfosuccess, errorCB);
    }
	function catinfosuccess(tx, results)
	{
		var User = results.rows.item(0).name;
		var parameter = location.search.split('parameter=')[1];
		var newparameter = parameter.replace(/%20/g," ");
		document.getElementById('cat').innerHTML = newparameter;
		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];
		var d = new Date();
		var current_month = monthNames[d.getMonth()];
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() 
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				$('ul#catinfo').append(xmlhttp.responseText).listview('refresh');
			}
		}
		var params = "User="+User+ " &catname=" +parameter+ "&Month=" +current_month;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/catinfo.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
	}
//--------------------------------- ---------------END OF CATEGORY INFORATION W/ DATABASE ------------------------//
		
//-------------------------------------------------DYNAMIC CATEGORY ------------------------------------------------//
	$(document).on("pageshow","#add_expense",function(){
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(CAT, errorCB);  
		});	
	function CAT(tx) {
        tx.executeSql('SELECT * FROM User', [], CATsuces, errorCB);
    }
	function CATsuces(tx, results)
	{
		var UName = results.rows.item(0).name;
		var monthNames = ["January", "February", "March", "April", "May", "June",
					  "July", "August", "September", "October", "November", "December"];
		var FG = new Date();
		var karonmonth = monthNames[FG.getMonth()];
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					$('select#cat_options').append(xmlhttp.responseText).listview('refresh');
				}
			}
			var params = "User="+UName+ " &Month=" +karonmonth;
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/cat_options.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
	}
	
//--------------------------- ------------------END OF CATEGORY -------------------------------------//

//----------------------------------------------Remaining Balance on category Page ------------------//
	$(document).on("pagebeforeshow","#add_category",function(){
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(remainbalancesucccess, errorCB);  
		});	
		function remainbalancesucccess(tx) {
        tx.executeSql('SELECT * FROM User', [], remainbalancesucccess2, errorCB);
		}
		function remainbalancesucccess2(tx, results){
		var UserNAME = results.rows.item(0).name;
		var monthNames = ["January", "February", "March", "April", "May", "June",
					  "July", "August", "September", "October", "November", "December"];
		var AS = new Date();
		var nowmonth = monthNames[AS.getMonth()];
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					// $('#balance').append(xmlhttp.responseText).listview('refresh');
					document.getElementById('balance').innerHTML = xmlhttp.responseText;
				}
			}
			var params = "User="+UserNAME+ " &Month=" +nowmonth;
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/remaining_balance.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
//---------------------------------------------End of Remaining Balance -----------------//
//--------------------------- ------------------Add expense with database ----------------//
	function addexpense() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(addexpensesuccess, errorCB);
    }
	    function addexpensesuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], addexpensesuccess2, errorCB);
    }
	    function addexpensesuccess2(tx, results)
	{
		var User = results.rows.item(0).name;
		var ExName = document.getElementById('ExName').value;
		var Price = document.getElementById('Price').value;
		var cat_options = document.getElementById('cat_options').value;
		var monthNames = ["January", "February", "March", "April", "May", "June",
					  "July", "August", "September", "October", "November", "December"];
		var Ha = new Date();
		var today = monthNames[Ha.getMonth()];
		if(ExName == '' || Price == '' || cat_options == '')
		{
			alert('All of the fields are required');
		}
		else
		{
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					var Response = xmlhttp.responseText;
					// alert(Response);
					if(Response == 1)
					{
						alert('Expense Recorded!');
						window.location.href = "homepage.html";						
					}
					else{
						alert(Response);
					}
				}
			}
			var params = "User="+User+ " &ExpenseName=" +ExName+ " &Price=" +Price+ " &cat_options=" +cat_options+ "&Month=" +today;
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/add_expense.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
    }
//------------------------------------------END --------------------------------------------------//

//------------------------------------------ ADD BUDGET FOR THE MONTH ---------------------------//
	function AddBudget() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(BudgetQuery, errorCB);
    }
	    function BudgetQuery(tx) {
        tx.executeSql('SELECT * FROM User', [], BudgetSuccess, errorCB);
    }
	    function BudgetSuccess(tx, results)
	{
		var Username = results.rows.item(0).name;
		var Budget = document.getElementById('Budget').value;
		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];
		var d = new Date();
		var current_month = monthNames[d.getMonth()];
		var year = d.getFullYear();
		if(Budget == '')
		{
			alert('Please fill up all of the fields.');
		}
		else
		{
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					var Response = xmlhttp.responseText;
					if(Response == 1)
					{
						alert('Budget added for the month of ' +current_month);
						window.location.href = "homepage.html";
					}
					else{
						alert(Response);
					}
				}
			}
			var params = "Username="+Username+ " &Budget=" +Budget+ " &Month=" +current_month+ "&Year=" +year;
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/add_budget.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
    }
//------------------------------------------END OF ADD BUDGET -----------------------------------//

//----------------------------------------- ADD CATEGORY WITH DATABASE --------------------//
	function AddCategory() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(AddCategorysuccess, errorCB);
    }

	function AddCategorysuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], AddCategorysuccess2, errorCB);
    }
	
	function AddCategorysuccess2(tx, results)
	{
		var User = results.rows.item(0).name;
		var Cat_Name = document.getElementById('Cat_Name').value;
		var Budget = document.getElementById('Budget').value;
		var color = document.getElementById('color').value;
		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];
		var d = new Date();
		var current_month = monthNames[d.getMonth()];
		var current_year = d.getFullYear();
		if(Cat_Name == '' || Budget == '')
		{
			alert('All of the fields are required');
		}
		else
		{
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					var Response = xmlhttp.responseText +"";
					if(Response == 1)
					{
						alert('Successfully recorded category!');
						window.location.href = "homepage.html";
					}
					else{
						alert(Response);
					}
				}
			}
			var params = "User="+User+ " &Cat_Name=" +Cat_Name+ "&Budget=" +Budget+ " &current_month=" +current_month+ " &current_year=" +current_year+ "&color=" +color;	
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/add_category.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
    }
// -----------------------------------------END OF ADD CATEGORY ------------------------------//

//------------------------------------------DISPLAY BUDGET -----------------------------------//
	$(document).on("pagebeforeshow","#budget",function(){
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(displaysuccess, errorCB);
	});
	function displaysuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], displaysecond, errorCB);
    }
	function displaysecond(tx, results) {
		var nameuser = results.rows.item(0).name;		
		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];
		var d = new Date();
		var current_month = monthNames[d.getMonth()];
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
		{
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				//var Response = xmlhttp.responseText;
				$('ul#displaybudget').append(xmlhttp.responseText).listview('refresh');
            }
        }
		var params = "Username="+nameuser+ " &Month=" +current_month;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/displaybudget.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
		}

//------------------------------------------END OF DISPLAY BUDGET ----------------------------//

//------------------------------------------ dynamic report display ---------------------------//
	$(document).on("pagebeforeshow","#reports",function(){
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(reportsuccess, errorCB);
	});
	function reportsuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], secondreportsuccess, errorCB);
    }
	function secondreportsuccess(tx, results) {
		var username = results.rows.item(0).name;		
		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];
		var d = new Date();
		var current_month = monthNames[d.getMonth()];
		var year = d.getFullYear();
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
		{
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				$('ul#haha').append(xmlhttp.responseText).listview('refresh');
				yearoptions();
            }
        }
		var params = "User="+username+ " &Month=" +current_month+ "&Year=" +year;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/reportdisplay.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
		}
//------------------------------------------- END OF DISPLAY BUDGET ---------------------------//

//--------------------------------------------update report ----------------------------------//
	function updatereport(){
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(updatesuccess, errorCB);
	}
	
	function updatesuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], secondupdatesuccess, errorCB);
    }
	function secondupdatesuccess(tx, results) {
		var user1 = results.rows.item(0).name;
		var month = document.getElementById('month').value;
		var year  = document.getElementById('year').value;
		if(month == '' || year == '')
		{
			alert('You must select both a month and year for the report.');
		}
		else{
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() 
			{
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				{
					document.getElementById('haha').innerHTML = xmlhttp.responseText;
					$('ul#haha').listview('refresh');
				}
			}
			var params = "User="+user1+ " &Month=" +month+ "&Year=" +year;
			xmlhttp.open("POST","http://www.databasemaniix.comxa.com/updatereport.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", params.length);
			xmlhttp.send(params);
		}
	
	}
//--------------------------------------------END OF REPORT ----------------------------------//

//-------------------------------------------- Dynamic Year options --------------------------//
	function yearoptions()
	{
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(yearsuccess, errorCB);
	}
	function yearsuccess(tx) {
        tx.executeSql('SELECT * FROM User', [], secondyearsuccess, errorCB);
    }
	function secondyearsuccess(tx, results) {
		var user2 = results.rows.item(0).name;		
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
		{
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				var response = xmlhttp.responseText
				  $('select#year').append(response);
            }
        }
		var params = "User="+user2;
		xmlhttp.open("POST","http://www.databasemaniix.comxa.com/yearoptions.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-length", params.length);
		xmlhttp.send(params);
		}
//-------------------------------------------- End of year options ----------------------------//

//------------------------------------------- ERROR FUNCTION ----------------------------------//
	function errorCB(err) {
		alert('There is an error!: '+err.message+ '\nSecond Message:!' +err);
    }
//------------------------------------------- END ---------------------------------------------//

//-------------------------------------------------AJAX OPTIONS, DO NOT CHANGE PLEASE ---------------------------//
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
		options.async = true;
	});
//-------------------------------------------------END OF AJAX OPTIONS ------------------------------------------------//	