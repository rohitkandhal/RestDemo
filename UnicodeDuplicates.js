// Problem: GET Duplicate characters in a Unicode String
// Approach:
// 1. Unicode characters representation: '\uXXXX' 6 char long ( \u + 4 digit HEX code)
// 2. Convert the input string to unicode escaped string.
//      e.g. 'AABB' -> '\\u0041\\u0041\\u0042\\u0042'
// 3. Split this string for individual character using regex.
// 4. Loop through each character returned by regex match and build a hash table for "seen" characters
//      a. If an element is previously seen, then add it to another output hashtable.
//      b. If an element exists in both seen and duplicates, then don't do anything. It's a repeated duplicate.
// 5. Using the duplicate hashtable (whose key is the unicode), convert each key to char and
//      join them to build output string.

// Assumptions:
// 1. Input string can have unicode code e.g. Inp can be '\u0041\u0041\u0042\u0042' for 'AABB'
// 2. Unicode escaped input is not handled e.g. '\\u0041' is not supported

// /(\\u[\d\w]{4})/g Regex - Find all matches for a UNICODE escaped word and return them as an individual group

function getDuplicates(inpStr) {
    var unicodeRegex = /(\\u[\d\w]{4})/g;
    var currChar;

    var seen = {};  // HashSet of all characters in input string
    var duplicates = {};    // HashSet of all duplicate characters

    var unicodeInpStr = toUnicode(inpStr);

    // regex.exec function works like a cursor
    while ((match = unicodeRegex.exec(unicodeInpStr))) {
        currChar = match[0];   // Regex Match result array has matched text in first element

        if(seen[currChar]) {

            if(duplicates[currChar] === undefined) {
                // Add to output only for first duplicate
                duplicates[currChar] = true;
            }
        } else {
            seen[currChar] = true;
        }
    }

    return Object.keys(duplicates).map(toCharFromUnicodeStr).join('');

    // Helper functions

    // Converts a string to unicode escaped string
    // e.g. '±²µ' -> "\\u00b1\\u00b2\\u00b5"
    function toUnicode(inp) {
        var result = '';

        for(var i = 0; i < inp.length; i += 1) {
            result += '\\u' + ('000' + inp[i].charCodeAt(0).toString(16)).substr(-4);
        }
        return result;
    }

    // Converts a Unicode excaped string to char
    // e.g. '\\u00b1' -> '±'
    function toCharFromUnicodeStr(inp) {
        var hexCode = inp.substr(2);  // '\\u00b1' -> '00b1'

        return String.fromCharCode(parseInt(hexCode, 16));
    }
}

// Test Cases
var test1 = {id: 1, inp: 'AABBCC', out: 'ABC'};
var test2 = {id: 2, inp: 'AABCCDd', out: 'AC'};
var test3 = {id: 3, inp: '', out: ''};
var test4 = {id: 4, inp: 'ABCD', out: ''};
var test5 = {id: 5, inp: '\u0041\u0041\u0043\u0043', out: 'AC'};
var test6 = {id: 6, inp: '\u0041\u0041CCC', out: 'AC'};
var test7 = {id: 7, inp: '\u0041\u0043AC', out: 'AC'};
var test8 = {id: 8, inp: 'AAAAAAAABCCCCCCCCCCCCCCCCCCCCCCCCC', out: 'AC'};
var test9 = {id: 9, inp: '±²µ±²µ', out: '±²µ'};
var test10 = {id: 10, inp: '±²µ', out: ''};
var test11 = {id: 11, inp: '±±±±±±²µµµµµµ', out: '±µ'};
var test12 = {id: 12, inp: '±±²µµAABBDd', out: '±µAB'};

function verifyDuplicates(testId, inp, expectedOut) {
    var duplicates;
    
    duplicates = getDuplicates(inp);
    console.log("Test# " + testId + ':', duplicates === expectedOut);
}

verifyDuplicates(test1.id, test1.inp, test1.out);
verifyDuplicates(test2.id, test2.inp, test2.out);
verifyDuplicates(test3.id, test3.inp, test3.out);
verifyDuplicates(test4.id, test4.inp, test4.out);
verifyDuplicates(test5.id, test5.inp, test5.out);
verifyDuplicates(test6.id, test6.inp, test6.out);
verifyDuplicates(test7.id, test7.inp, test7.out);
verifyDuplicates(test8.id, test8.inp, test8.out);
verifyDuplicates(test9.id, test9.inp, test9.out);
verifyDuplicates(test10.id, test10.inp, test10.out);
verifyDuplicates(test11.id, test11.inp, test11.out);
verifyDuplicates(test12.id, test12.inp, test12.out);

