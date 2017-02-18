(function() {
    var numCorrect = 0;
    var questions = [
        {
            question: "Que cidade foi, durante alguns anos, a capital do Reino de Portugal?",
            choices: ["Díli", "Faro", "Rio de Janeiro", "Luanda"],
            correctAnswer: 2
        },
        {
            question: "Quantos Portugueses estiveram envolvidos no massacre de 84 Mil Indianos na Batalha de Cochim em 1504?",
            choices: ["251", "140", "10 Mil", "120 Mil", "1594"],
            correctAnswer: 1
        },
        {
            question: "Qual desde produtos foi introduzido ao Reino Unido por Portugal?",
            choices: ["Pastéis de Nata", "Chá", "Café"],
            correctAnswer: 1
        },
        {
            question: "Qual o produto mais exportado de Portugal?",
            choices: ["Veículos", "Óleo", "Sapatos", "Plástico", "Maquinaria", "Papel"],
            correctAnswer: 0
        },
        {
            question: "Qual a Nacionalidade do ator Herman José?",
            choices: ["Portuguesa", "Italiana", "Alemã", "Suiça"],
            correctAnswer: 0
        },
        {
            question: "Em 2016, que lugar ocupava Portugal na lista dos países mais ricos?",
            choices: ["46", "124", "12", "52", "64"],
            correctAnswer: 0
        },
        {
            question: "Em que ano foi assinado o tratado de Tordesilhas?",
            choices: ["1389", "1494", "1592", "1432", "1674"],
            correctAnswer: 1
        },
        {
            question: "Quantas pessoas falam Mirandês?",
            choices: ["500", "Entre 7 Mil a 10 Mil", "Entre 10 Mil e 20 Mil", "2", "Entre 5 Mil e 7 Mil"],
            correctAnswer: 1
        }
    ];

    var questionCounter = 0; //Tracks a number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object

    // Display initial
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if(quiz.is(':animated')) {
            return false;
        }
        choose();

        // If no user selection, progress is stopped
        if (isNaN(selections[questionCounter])) {
            alert('Por favor selecione uma opção');
        } else {
            questionCounter++;
            displayNext();
        }
    });

    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
        e.preventDefault();

        if(quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
        e.preventDefault();

        if(quiz.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
    });

    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Creates and returns the div that contains the questions and
    // the answer selections
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h2>Pergunta ' + (index + 1) + ':</h2>');
        qElement.append(header);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
        var radioList = $('<ul>');
        var item;
        var input = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            item = $('<li>');
            input = '<label><input type="radio" name="answer" value=' + i + ' />';
            input += questions[index].choices[i]+'</label>';
            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }

    // Reads the user selection and pushes the value to an array
    function choose() {
        selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }

    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function() {
            $('#question').remove();

            if(questionCounter < questions.length){
                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value='+selections[questionCounter]+']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if(questionCounter === 1){
                    $('#prev').show();
                } else if(questionCounter === 0){

                    $('#prev').hide();
                    $('#next').show();
                }
            }else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
            }
        });
    }

    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p>',{id: 'question'});

        numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[i].correctAnswer) {
                numCorrect++;
            }
        }

        score.append('Acertaste em ' + numCorrect + ' de '+questions.length+' respostas.');
        $("#share-result").show();
        return score;
    }
    $(document).on('click', '#share-result', function(){
        FB.ui({
            method: 'share',
            quote: "Eu acertei em "+numCorrect+" de "+questions.length,
            href: window.location.href
        }, function(response){});
        ga('send', 'event', 'Quiz', 'shared', 'Quiz mais difícil sobre Portugal');
    });

})();