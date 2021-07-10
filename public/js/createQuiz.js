// let ques = 'ques';
// let cnt = 1;


const questionForm = ` <div> <strong>Question</strong></div>

<div class="input-group input-group-lg" style="margin: 20px 0px;">
                        <input type="text" class="form-control" aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-lg" placeholder="Question" name="question">
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default" placeholder="Option1" name="option1">
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default" placeholder="Option2" name="option2">
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default" placeholder="Option3" name="option3">
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default" placeholder="Option4" name="option4">
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default" placeholder="Correct Answer" name="correct_answer">
                    </div>
                    <hr>
                    `



const questions = document.getElementById('questions');

document.getElementById('add-Question').addEventListener('click', () => {
    const questionDiv = document.createElement('div');
    questionDiv.className = `ques`;
    questionDiv.innerHTML = questionForm;
    questions.appendChild(questionDiv);
})
