
dosageApp.controller('DrugListCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $scope.search = {
      'drugIndicationListQuery': ''
    };

    $scope.patient = {
      'weight': 15.0,
      'diagnostic': 'faringitis'
    };

    $scope.drugs = null;
    $http.get('/data/drugs.json').then(
      function(response) {
        $scope.drugs = response.data;
      }
    );

    $scope.drugPosology = function drugPosology(drug, dosage) {
      /* quantity of drug to be administered in each dose */
      var total = Math.round(dosage * $scope.patient.weight),
          perDose = Math.round(total / drug.doses),
          hours = 24 / drug.doses;
      return {'total': total, 'perDose': perDose, 'hours': hours};
    }

    $scope.drugQuantity = function drugQuantity(drug, dosage) {
      /* total quantity of solution to be administered per dose */
      var posology = $scope.drugPosology(drug, dosage);
      return (posology.perDose * drug.suspensionMl) / drug.suspensionMg;
    }

    $scope.drugDosages = function drugDosages(drug) {
      /* returns the range of doses for a particular drug and diagnostic */
      var drugIndication = drug.indications[$scope.patient.diagnostic],
          dmin = drugIndication.minDose,
          dmax = drugIndication.maxDose,
          dosages = [],
          step = (dmax - dmin >= 20) ? 10 : 5;

      for (var d = dmin; d <= dmax; d += step){
        dosages.push(d);
      }
      return dosages;
    }

    $scope.drugOrIndicationFilter = function drugOrIndicationFilter(){
      return function(item){
        var term = $scope.search.drugIndicationListQuery.toLowerCase(),
            indication = false;

        if (item.name.toLowerCase().indexOf(term) === 0) {
          return true;
        }

        angular.forEach(item.indications, function(value, key){
          var diagnostic = key.toLowerCase();
              hasIndication = (diagnostic.indexOf(term) === 0)

          if (hasIndication) {
            $scope.patient.diagnostic = diagnostic;
            indication = true;
          }
        });
        return indication;
      }
    }

    $scope.validateInputWeight = function validateInputWeight() {
      return $('#inputWeight')[0].checkValidity();
    }

    $scope.setInputWeight = function setInputWeight() {
      return $scope.patient.weight = $('#inputWeight').val();
    }

  }
]);

