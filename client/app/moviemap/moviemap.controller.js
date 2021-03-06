'use strict';



(function () {

  class MoviemapComponent {
    constructor($http, socket, $scope) {
      this.message = 'Hello';
      this.$scope = $scope;
      this.socket = socket;
      this.cinemas = [];
      this.movie = [];
      this.theater = [];
      this.city = [];
      this.states = [];
      this.locations = [];
      this.scl;
      this.sname;
      this.$http = $http;
      this.dates = [];
      this.hour = [];
      this.min = [];
      this.timings = [];
      this.data = {};
      this.poster;
      this.backdrop;
      this.tagline;
      this.ratings;
      
    }

    $onInit() {

      // $("img").error(function(){
      //     $(this).hide();
      // });
      //--------------------------------------------------------------------------------------------------

      // $('#add_time').click(function(){
      //   var hh = $('#hour').val();
      //   var mm = $('#min').val();
      //   var ampm = $('#ampm').val();
      //   var tt = hh+':'+mm+' '+ampm;
      //   console.log(tt);
      //   var i;
      //   for(i=0; i<ttAr.length; i++){
      //     var duplicate = false;
      //     if(tt == ttAr[i]){
      //       duplicate = true;
      //       console.log('duplicate found');
      //     }
      //   }
      //   if(duplicate == true){
      //     alert(tt+' already added');
      //   }else{
      //   // this.timings=tt;
      //     ttAr.push(tt);
      //    // show(ttAr);
      //   //  $scope.aa;
      //     //$scope.aa=tt;
      //   }
      //   console.log(this.timings);

      // });



      //$digest or $apply
      //this.timings=ttAr;









      //-----------------------------------------------------------------------------------------------------------
      this.$http.get('/api/Movies').then((response) => {
        this.movie = response.data;
        console.log(this.movie);
      });

      this.$http.get('/api/theaters').then((response) => {
        this.theater = response.data;
        let cities = [];
        let states = [];
        let locations = [];
        let scl = {};
        scl['states'] = {};
        scl['cities'] = {};
        let sname = [];
        for (let i = 0; i < this.theater.length; i++) {
          if (cities.indexOf(this.theater[i].City) === -1) {
            cities.push(this.theater[i].City);
            
          }

          if (states.indexOf(this.theater[i].State) === -1) {
            states.push(this.theater[i].State);
          }

          if (locations.indexOf(this.theater[i].Location) === -1) {
            locations.push(this.theater[i].Location);
          }
        }
        
        for(let i=0; i<states.length; i++){
          scl.states[states[i]] = [];
          for (let j = 0; j < this.theater.length; j++) {
            if(this.theater[j].State === states[i]){
              if(scl.states[states[i]].indexOf(this.theater[j].City) === -1){
                scl.states[states[i]].push(this.theater[j].City);
              }
            }
          }          
        }

        for(let i=0; i<cities.length; i++){
          scl.cities[cities[i]] = [];
          for (let j = 0; j < this.theater.length; j++) {
            if(this.theater[j].City === cities[i]){
              if(scl.cities[cities[i]].indexOf(this.theater[j].Location) === -1){
                scl.cities[cities[i]].push(this.theater[j].Location);
              }
            }
          }
        }

        for(let prop in scl.states){
          sname.push(prop);
        }
        console.log(this.theater);
        console.log(cities);
        console.log(states);
        console.log(locations);
        console.log(scl);
        console.log(sname);
        this.city = cities;
        this.states = states;
        this.locations = locations;
        this.scl = scl;
        this.sname = sname;
      });

      this.$http.get('/api/cinemas').then((response) => {
        this.cinemas = response.data;
        console.log(this.cinemas);
        this.socket.syncUpdates('cinema', this.cinemas);
      });

      var date = new Date();
      var day = moment(date);
      console.log(day);

      
      for (let i = 0; i < 6; i++) {
        this.dates[i] = day.add(1, 'd').format('MMM DD');
      }

      console.log(this.dates);

    
      var h = 1;
      for (let j = 0; j < 12; j++) {
        this.hour[j] = h;
        if (this.hour[j] < 10) {
          this.hour[j] = '0' + h;
        }
        h++;
      }

      
      for (let l = 0; l < 12; l++) {
        this.min[l] = l * 5;
        if (this.min[l] < 10) {
          this.min[l] = '0' + l * 5;
        }
      }

    }


    savetime() {

      var hh = this.data.h;
      var mm = this.data.m;
      var ampm = this.data.ampm;
      var tt = hh + ':' + mm + ' ' + ampm;
      console.log(tt);

      var i;
      for (i = 0; i < this.timings.length; i++) {
        var duplicate = false;
        if (tt == this.timings[i]) {
          duplicate = true;
          console.log('duplicate found');
        }
      }

      if (duplicate == true) {
        alert(tt + ' already added');
      } else {
        this.timings.push(tt);
      }

      console.log(this.data);
      console.log(this.timings);
    }

    deletetime(time) {
      var i = this.timings.indexOf(time);
      console.log(time);
      this.timings.splice(i, 1);
      console.log(this.timings);
    }

    deleteCinema(id) {
      if (confirm("Click OK to confirm deletion or Cancel to abort.")) {
        this.$http.delete('/api/cinemas/' + id).then((response) => {
          alert('Cinema Deleted Successfully!');
        });
      } else {
        alert('Action aborted');
      }
    }

    getPoster() {

      var index = this.movie.findIndex(item => item.Title === this.data.movieS);
      console.log(index);
      if (index !== -1) {
        this.poster = this.movie[index].Poster;
        this.backdrop = this.movie[index].backdrop;
        this.tagline = this.movie[index].tagline;
        this.ratings = this.movie[index].ratings;
        console.log(this.poster);
      }

    }

    submit() {
      var datemap = [];
      $('.days:checked').each(function () {
        datemap.push($(this).val());
      });
      if (datemap.length == 0) {
        alert('No date selected');
      }
      console.log(datemap);


      var items = {
        title: this.data.movieS,
        backdrop: this.backdrop,
        state: this.data.stateS,
        city: this.data.cityS,
        location: this.data.locationS,
        theater: this.data.theaterS,
        dates: datemap,
        times: this.timings,
        tagline: this.tagline,
        ratings: this.ratings
      };
      var valid = true;
      var check = Object.values(items);
      var check1 = Object.keys(items);

      for (var i = 0; i < check.length; i++) {

        if (Array.isArray(check[i])) {
          if (check[i].length == 0) {
            valid = false;
          }
        } else {
          if (check[i] == undefined) {
            valid = false;
          }
        }
      }
      console.log(valid);


      var cinema = this.cinemas;
      var dateCheck = true;
      var timeCheck = true;

      var sameD = [];
      var sameT = [];
      for (var i = 0; i < cinema.length; i++) {

        console.log(cinema[i].movie);
        if (cinema[i].movie.theaters.city == items.city && cinema[i].movie.theaters.name == items.theater) {
          var d1 = cinema[i].movie.theaters.dates;
          var t1 = cinema[i].movie.theaters.time;
          for (var j = 0; j < d1.length; j++) {
            if (items.dates.indexOf(d1[j]) !== -1) {
              console.log('same dates ' + d1[j]);
              dateCheck = false;
              sameD.push(d1[j]);
            }
          }

          if (!dateCheck) {
            for (var k = 0; k < t1.length; k++) {
              if (items.times.indexOf(t1[k]) !== -1) {
                console.log('same timings ' + t1[k]);
                timeCheck = false;
                sameT.push(t1[k]);
              }
            }
          }

          if (!dateCheck && timeCheck) {
            dateCheck = true;
          }
        }

      }

      var samet = [];
      for (var i = 0; i < sameT.length; i++) {
        if (samet.indexOf(sameT[i]) == -1) {
          samet.push(sameT[i]);
        }
      }

      var samed = [];
      for(let i = 0; i < sameD.length; i++) {
        if(samed.indexOf(sameD[i]) == -1) {
          samed.push(sameD[i]);
        }
      }

      var booked = function () {
        if (dateCheck && timeCheck) {
          return true;
        } else if (timeCheck) {
          return true;
        } else if (dateCheck) {
          return true;
        } else {
          return false;
        }
      }

      if (valid && booked()) {
        this.$http.post('/api/cinemas', {
          movie: {
            title: items.title,
            poster: this.poster,
            backdrop: items.backdrop,
            tagline: items.tagline,
            ratings: items.ratings,
            // imdb: this.movie[index].imdb_id,
            theaters: {
              name: items.theater,
              city: items.city,
              location:items.location,
              state: items.state,
              dates: items.dates,
              time: items.times
            }

          }
        }).then((response) => {
          alert('Success!');
          this.data.movieS = '';
          this.data.theaterS = '';
          this.data.cityS = '';
          this.data.locationS = '';
          this.data.stateS = '';
          this.poster = '';
          $('.days:checked').each(function () {
            this.checked = false;
          });
          datemap = [];
          this.timings = [];
        });
      } else if (!dateCheck && !timeCheck) {
        alert('Theater is booked for [' + samed + '] on time[' + samet + ']');
      } else {
        alert('Details Missing');
      }
    }

    // datepicker(){
    //   var clicked

    //   console.log(this.clicked);

    //   if(!this.clicked){
    //     console.log('if started');
    //     this.clicked = true;
    //   }else{
    //     console.log('else');
    //     this.clicked = false;
    //   }

    // }

    // $.noConflict();
    // jQuery(document).ready(function($){
    //     $("button").click(function(){
    //         $("p").text("jQuery is still working!");
    //     });
    // });

  }

  angular.module('yeomanAppApp')
    .component('moviemap', {
      templateUrl: 'app/moviemap/moviemap.html',
      controller: MoviemapComponent,
      controllerAs: 'moviemapCtrl'
    });

})();
