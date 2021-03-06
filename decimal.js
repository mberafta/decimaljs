var errorBlock = document.getElementById('alert'),
    errorDisplayer = document.getElementById('error');

/**
 * Classe Decimal traitant un nombre quelconque et renvoyant son arrondi à 2 décimales
 * @function Decimal
 * @param {number} val 
 */
function Decimal(val) {
    let test = !isNaN(+val);
    if (!test) {
        errorBlock.style.display = 'block';
        errorDisplayer.innerText = 'Veuillez saisir un nombre valide';
    }

    // Injection du service
    const dm = decimalManager();

    try {
        let rounded;
        let separatedParts = dm.getSeparatedParts(val),
            thirdDecimal = separatedParts.length > 2 ? dm.processDecimalParts(separatedParts) : 0;

        if (thirdDecimal != 0) {
            separatedParts.splice(separatedParts.length - 1, 1);
            separatedParts.push(thirdDecimal);
        }

        rounded = separatedParts[0];

        if (separatedParts.length > 1) {
            rounded += '.';
            for (let j = 1; j < separatedParts.length; j++) {
                if(j == separatedParts.length - 1){
                    if(thirdDecimal != 0){
                        rounded += separatedParts[j];
                    }
                }
                else{
                    rounded += separatedParts[j];
                }
            }
        }

        rounded = thirdDecimal == 0 ? rounded : dm.processThirdDecimal(rounded);

        this.value = rounded;
    }
    catch (e) {
        errorBlock.style.display = 'block';
        errorDisplayer.innerText = e.toString();
    }
}

/**
 * Service perméttant de manipuler un nombre réel
 * @function decimalManager
 */
const decimalManager = (() => {

    /**
     * Fonction perméttant de récupérer la partie entière et la partie décimale d'un nombre réel
     * @function getNumberParts
     * @param {number} x 
     */
    var getNumberParts = function (x) {
        let parts = x.toString().split('.');
        return parts;
    }

    /**
     * Fonction perméttant de découper la partie décimale d'un nombre réel en deux parties,
     * la première correspondant aux deux premières décimales et la seconde constituant le reste décimal à traiter
     * en vue de créer un arrondi en précision 2
     * @function getSeparatedParts
     * @param {number} x 
     */
    var getSeparatedParts = function (x) {
        let parts = [...getNumberParts(x)], // copie 
            result = [],
            len = parts.length;

        if (len == 1) { // On n'a pas de décimale
            result.push(parts[0]);
        }
        else {
            result.push(parts[0]);
            let subParts = [],
                mainDecimalPart = parts[1].substring(0, 2),
                decimalPartToProcess = parts[1].substring(2, parts[1].length);

            subParts.push(mainDecimalPart);
            subParts.push(decimalPartToProcess);
            result.push(...subParts);
        }

        return result;
    }

    /**
     * Fonction perméttant de trouver créer un arrondi initial à trois décimales
     * @function processDecimalParts
     * @param {Array} arr 
     */
    var processDecimalParts = function (arr) {
        arr = arr[arr.length - 1].split('');

        try {
            if (arr.length > 0) {
                while (arr.length > 1) {
                    let len = arr.length;
                    let last = Number(arr[len - 1]),
                        prevLast = Number(arr[len - 2]);
                    if (last >= 5) {
                        prevLast++;
                    }

                    arr[len - 2] = prevLast;
                    arr.splice(len - 1, 1);
                }
                return +arr[0];
            }
            else {
                return 0;
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * Fonction perméttant de traiter la troisième décimale sur un nombre sous forme de chaine
     * afin de créer l'arrondi à 2 décimales
     * @function processDecimalParts
     * @param {string} str 
     */
    var processThirdDecimal = function (str) {
        let parts = str.split('.'),
            characters = str.split(''),
            subParts = parts[1].split(''),
            thirdDecimal = isNaN(+subParts[2]) ? 0 : +subParts[2],
            sndDecimal = isNaN(+subParts[1]) ? 0 : +subParts[1],
            firstDecimal = isNaN(+subParts[0]) ? 0 : subParts[0];

        if (thirdDecimal >= 5) {
            if (sndDecimal < 9) {
                sndDecimal++;
            }
            else {
                firstDecimal++;
                if (firstDecimal == 10) {
                    firstDecimal = 0;
                    parts[0] = +parts[0] + 1;
                }
                sndDecimal = 0;
            }

        }

        parts[1] = replace(parts[1], 0, firstDecimal);
        parts[1] = replace(parts[1], 1, sndDecimal);
        parts[1] = replace(parts[1], 2, "0");

        return +parts.join('.');

    }

    /**
     * Fonction perméttant de remplacer un caractère par un autre sur une chaine
     * @function replace
     * @param {string} str 
     * @param {number} index 
     * @param {string} replacement 
     */
    var replace = function (str, index, replacement) {
        let firstPart = str.substr(0, index),
            endPart = str.substr(index + 1),
            result = firstPart + replacement + endPart;
        return result;
    }

    return {
        getNumberParts: getNumberParts,
        getSeparatedParts: getSeparatedParts,
        processDecimalParts: processDecimalParts,
        processThirdDecimal: processThirdDecimal
    };
});