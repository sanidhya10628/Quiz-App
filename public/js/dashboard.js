// console.log("i")

// document.forms['quizform']['noofquestion'].value;
// function a() {

//     const noofquestion = document.forms['quizform']['noofquestion'].value;
//     const selectcategory = document.forms['quizform']['selectcategory'].value;
//     const selectdifficulty = document.forms['quizform']['selectdifficulty'].value;
//     const selecttype = document.forms['quizform']['selecttype'].value;

//     const quiz = d(noofquestion, selectcategory, selectdifficulty, selecttype);

//     // console.log(noofquestion)
//     return false;
// }

// async function d(noofquestion, selectcategory, selectdifficulty, selecttype) {
//     const data = await fetch(`https://opentdb.com/api.php?amount=${noofquestion}&category=${selectcategory}&difficulty=${selectdifficulty}&type=${selecttype}`);
//     const quizd = await data.json();
//     const quiz = quizd['results'];
//     return quiz;
//     // console.log(quiz);
// }

