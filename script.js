        document.addEventListener('DOMContentLoaded', function() {
            const initialData = [];

            const tableBody = document.getElementById('gradesTableBody');
            const calculateBtn = document.getElementById('calculateBtn');
            const addRowBtn = document.getElementById('addRowBtn');

            initialData.forEach(subject => {
                addRowToTable(subject);
            });

            calculateBtn.addEventListener('click', calculateGrades);

            addRowBtn.addEventListener('click', function() {
                addRowToTable({
                    matter: '',
                    notes: [null, null, null, null, null],
                    Qf: 1,
                    tt: 0
                });
            });

            function addRowToTable(subject) {
                const row = document.createElement('tr');
                
                const matterCell = document.createElement('td');
                const matterInput = document.createElement('input');
                matterInput.type = 'text';
                matterInput.value = subject.matter;
                matterInput.placeholder = 'Name';
                matterCell.appendChild(matterInput);
                row.appendChild(matterCell);
                
                for (let i = 0; i < 5; i++) {
                    const noteCell = document.createElement('td');
                    const noteInput = document.createElement('input');
                    noteInput.type = 'number';
                    noteInput.step = '0.01';
                    noteInput.min = '0';
                    noteInput.max = '20';
                    noteInput.value = subject.notes[i] !== null ? subject.notes[i] : '';
                    noteInput.placeholder = 'Note ' + (i + 1);
                    noteCell.appendChild(noteInput);
                    row.appendChild(noteCell);
                }
                
                const qfCell = document.createElement('td');
                const qfInput = document.createElement('input');
                qfInput.type = 'number';
                qfInput.min = '0';
                qfInput.value = subject.Qf;
                qfCell.appendChild(qfInput);
                row.appendChild(qfCell);
                
                
                const ttCell = document.createElement('td');
                const ttSpan = document.createElement('span');
                ttSpan.textContent = subject.tt.toFixed(4);
                ttCell.appendChild(ttSpan);
                row.appendChild(ttCell);
                
                
                const actionsCell = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'امسح';
                deleteBtn.addEventListener('click', function() {
                    tableBody.removeChild(row);
                });
                actionsCell.appendChild(deleteBtn);
                row.appendChild(actionsCell);
                
                tableBody.appendChild(row);
            }

            function calculateGrades() {
                const rows = tableBody.querySelectorAll('tr');
                let sumQf = 0;
                let sumTt = 0;
                let sumSimpleAverages = 0;
                let sumWeightedAverages = 0;
                let subjectCount = 0;
                
                rows.forEach(row => {
                    const inputs = row.querySelectorAll('input');
                    const matter = inputs[0].value;
                    
                    const notes = [];
                    for (let i = 1; i <= 5; i++) {
                        const value = inputs[i].value.trim();
                        notes.push(value === '' ? null : parseFloat(value));
                    }
                    
                    const Qf = parseFloat(inputs[6].value);
                    
                    const validNotes = notes.filter(note => note !== null);
                    const notesSum = validNotes.reduce((sum, note) => sum + note, 0);
                    const average = validNotes.length > 0 ? notesSum / validNotes.length : 0;
                    
                    const Tt = average * Qf;
                    
                    row.querySelector('td:nth-last-child(2) span').textContent = Tt.toFixed(4);
                    
                    sumQf += Qf;
                    sumTt += Tt;
                    sumSimpleAverages += average;
                    sumWeightedAverages += average * Qf;
                    subjectCount++;
                });
                
                const noteS1 = subjectCount > 0 ? sumSimpleAverages / subjectCount : 0;
                const noteS2 = sumQf > 0 ? sumWeightedAverages / sumQf : 0;
                const ttAnnee = sumQf * sumTt;
                
                document.getElementById('noteS1').textContent = noteS1.toFixed(2);
                document.getElementById('noteS2').textContent = noteS2.toFixed(2);
                document.getElementById('ttAnnee').textContent = ttAnnee.toFixed(2);
            }
        });





