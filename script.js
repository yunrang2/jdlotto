let selectedNumbers = [];
let drawCount = 1;
const selectSound = document.getElementById('selectSound');
const resultSound = document.getElementById('resultSound');

function playSelectSound() {
    selectSound.currentTime = 0;
    selectSound.volume = 0.8;  // 볼륨을 80%로 설정
    selectSound.play();
}

function playResultSound() {
    resultSound.currentTime = 0;
    resultSound.play();
}

function selectNumber(element) {
    const number = parseInt(element.textContent);
    
    if (selectedNumbers.includes(number)) {
        // 이미 선택된 숫자를 다시 클릭하면 선택 해제
        selectedNumbers = selectedNumbers.filter(n => n !== number);
        element.classList.remove('selected');
    } else {
        // 최대 6개의 숫자만 선택 가능
        if (selectedNumbers.length < 6) {
            selectedNumbers.push(number);
            element.classList.add('selected');
            playSelectSound();
        } else {
            alert('6개의 숫자만 선택할 수 있습니다.');
        }
    }

    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ' + selectedNumbers.join(', ');
}

function selectRandomNumbers() {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    selectedNumbers = [];

    // 모든 숫자 요소의 선택 클래스 제거
    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));

    while (selectedNumbers.length < 6) {
        const randomIndex = Math.floor(Math.random() * allNumbers.length);
        const randomNumber = allNumbers.splice(randomIndex, 1)[0];
        selectedNumbers.push(randomNumber);

        // 선택된 숫자에 선택 클래스 추가
        document.querySelector(`.number:nth-child(${randomNumber})`).classList.add('selected');
    }

    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ' + selectedNumbers.join(', ');
    playSelectSound();
}

function submitNumbers() {
    if (selectedNumbers.length === 6) {
        document.getElementById('selectionScreen').classList.add('hidden');
        document.getElementById('selectionInstruction').classList.add('hidden');
        document.getElementById('randomButton').classList.add('hidden');
        document.getElementById('resultScreen').classList.remove('hidden');
        document.getElementById('resultTitle').textContent = `${drawCount}회차 당첨결과`;
        startRandomNumberGeneration();
        drawCount++;
    } else {
        alert('6개의 숫자를 모두 선택해 주세요.');
    }
}

function startRandomNumberGeneration() {
    const randomNumbersDiv = document.getElementById('randomNumbers');
    randomNumbersDiv.innerHTML = '';

    const userNumbersDiv = document.getElementById('userNumbers');
    userNumbersDiv.innerHTML = '';

    const bonusNumberDiv = document.getElementById('bonusNumber');
    bonusNumberDiv.innerHTML = '';

    const randomNumbers = [];
    const userNumbers = [];

    for (let i = 0; i < 6; i++) {
        const randomDiv = document.createElement('div');
        randomDiv.classList.add('random-number');
        randomDiv.textContent = '?';
        randomNumbersDiv.appendChild(randomDiv);
        randomNumbers.push(randomDiv);

        const userDiv = document.createElement('div');
        userDiv.classList.add('user-number');
        userDiv.textContent = selectedNumbers[i];
        userNumbersDiv.appendChild(userDiv);
        userNumbers.push(userDiv);
    }

    const bonusDiv = document.createElement('div');
    bonusDiv.classList.add('bonus-number');
    bonusDiv.textContent = '?';
    bonusNumberDiv.appendChild(bonusDiv);

    let currentIndex = 0;
    const generatedNumbers = new Set();

    function generateNumber() {
        if (currentIndex < randomNumbers.length) {
            let interval = setInterval(() => {
                let randomNumber;
                do {
                    randomNumber = Math.floor(Math.random() * 45) + 1;
                } while (generatedNumbers.has(randomNumber));
                randomNumbers[currentIndex].textContent = randomNumber;
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                const finalNumber = parseInt(randomNumbers[currentIndex].textContent);
                generatedNumbers.add(finalNumber);
                if (selectedNumbers.includes(finalNumber)) {
                    randomNumbers[currentIndex].classList.add('highlight');
                    userNumbers[selectedNumbers.indexOf(finalNumber)].classList.add('highlight');
                }
                currentIndex++;
                generateNumber();
            }, 1000);
        } else {
            generateBonusNumber();
        }
    }

    function generateBonusNumber() {
        let interval = setInterval(() => {
            let bonusNumber;
            do {
                bonusNumber = Math.floor(Math.random() * 45) + 1;
            } while (generatedNumbers.has(bonusNumber));
            bonusDiv.textContent = bonusNumber;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const finalBonusNumber = parseInt(bonusDiv.textContent);
            generatedNumbers.add(finalBonusNumber);
            bonusDiv.textContent = finalBonusNumber;
            checkMatches(finalBonusNumber);
        }, 1000);
    }

    generateNumber();
}

function checkMatches(finalBonusNumber) {
    const displayedNumbers = Array.from(document.getElementsByClassName('random-number')).map(div => parseInt(div.textContent));
    const matchedNumbers = selectedNumbers.filter(number => displayedNumbers.includes(number));
    const bonusMatch = selectedNumbers.includes(finalBonusNumber);

    let matchResultText;
    switch (matchedNumbers.length) {
        case 6:
            matchResultText = '1등: 당첨번호 6개 숫자 일치!';
            break;
        case 5:
            if (bonusMatch) {
                matchResultText = '2등: 당첨번호 5개 숫자 일치 + 보너스 숫자 일치!';
            } else {
                matchResultText = '3등: 당첨번호 5개 숫자 일치!';
            }
            break;
        case 4:
            matchResultText = '4등: 당첨번호 4개 숫자 일치!';
            break;
        case 3:
            matchResultText = '5등: 당첨번호 3개 숫자 일치!';
            break;
        default:
            matchResultText = '꽝!';
    }
    document.getElementById('matchResult').textContent = matchResultText;
    playResultSound();
    document.querySelector('.retry-button').classList.remove('hidden');
}

function retry() {
    // 선택된 숫자 초기화
    selectedNumbers = [];
    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ';

    // 화면 상태 초기화
    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));
    document.getElementById('selectionScreen').classList.remove('hidden');
    document.getElementById('selectionInstruction').classList.remove('hidden');
    document.getElementById('randomButton').classList.remove('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.querySelector('.retry-button').classList.add('hidden');
}
