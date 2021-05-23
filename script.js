// quiz data for the quiz app
const data = [
    {
        question:"The 'function' and 'var' are known as:",
        option1:"Keywords",
        option2:"Data types",
        option3:"Declaration statements",
        option4:"Prototypes",
        answer:"Declaration statements"
    },
      {
        question:"In JavaScript, what is a block of statement?",
        option1:"Conditional block",
        option2:"block that combines a number of statements into a single compound statement",
        option3:"both conditional block and a single statement",
        option4:"block that contains a single statement",
        answer:"block that combines a number of statements into a single compound statement"
    },
      {
        question:"Which of the following number object function returns the value of the number?",
        option1:"toString()",
        option2:"valueOf()",
        option3:"toLocaleString()",
        option4:"toPrecision()",
        answer:"valueOf()"
    },
      {
        question:"In JavaScript, what will be used for calling the function definition expression:",
        option1:"Function prototype",
        option2:"Function literal",
        option3:"Function calling",
        option4:"Function declaration",
        answer:"Function literal"
    },
      {
        question:"Which of the following one is the property of the primary expression:",
        option1:"Contains only keywords",
        option2:"basic expressions containing all necessary functions",
        option3:"contains variable references alone",
        option4:"stand-alone expressions",
        answer:"stand-alone expressions"
    }
]

// variables and constants used in the project
let curr = 0;
let score = 0;
const arr = document.getElementsByClassName('opt');
const ques = document.getElementById('question');
const btn1 = document.getElementsByClassName('btn-1');

// to display the questions and the final score
document.getElementById('next').addEventListener('click',myfunc)

// to get the user input
for(let i=0;i<arr.length;i++)
{
    document.getElementsByClassName('opt')[i].addEventListener('click',function(){
    const user_input = arr[i].textContent;

    //console.log(user_input);
    //console.log(data[curr].answer)


    if(user_input===data[curr].answer)
    {
        score += 1;
    }
    curr += 1; // to update the curr variable so that it can move forward.
    //console.log(score);
})
}



// to hide the question at the start.
document.getElementById('question').style.display = "none";
for(let i=0;i<arr.length;i++)
{
    arr[i].style.display = "none";
}
// to hide the option buttons
document.getElementsByClassName('start-btn')[0].addEventListener('click',function(){
    if(curr===0)
    {
        myfunc();
    }
    for(let i=0;i<arr.length;i++)
    {
        arr[i].style.display = "block";
    }
    ques.style.display = "block";
    document.getElementById('start').style.display = "none";
})

for(let i=0;i<btn1.length;i++)
{
    btn1[i].style.display = "none";
}

document.getElementsByClassName('start-btn')[0].addEventListener('click',function(){
    for(let i=0;i<btn1.length;i++)
    {
        btn1[i].style.display = "block";
    }
    // for(let i=0;i<arr.length;i++)
    // {
    //     arr[i].style.display = "block";
    // }

    //ques.style.display = "block";
})



function myfunc()
{
    const question = document.getElementById('question');
    if(curr>=data.length)
    {
        document.getElementsByTagName('section')[0].style.display = "none";
        document.getElementById('result').innerHTML = "<h1>Your Score is </h1>" + "<h1> " +score +"</h1>";
    }
    else{
        question.innerHTML = data[curr].question + "<br>";

        const opt1 = document.getElementById('option1');
        opt1.innerHTML = data[curr].option1;

        const opt2 = document.getElementById('option2');
        opt2.innerHTML = data[curr].option2;

        const opt3 = document.getElementById('option3');
        opt3.innerHTML = data[curr].option3;

        const opt4 = document.getElementById('option4');
        opt4.innerHTML = data[curr].option4;

    }
}



// to remove the start button after click on it
document.getElementById('start').addEventListener('click',function(){
    let r = document.getElementById('sb')
// console.log(r.classList);
r.classList.remove('start-btn1');

let s = document.getElementById('start');
// console.log(s.classList);
s.classList.remove('start-btn');
})