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






        
        function downloadPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text("Tableau des Notes", 10, 10);

            const table = document.getElementById('gradesTable');
            let startY = 20;

            const headers = [];
            table.querySelectorAll('thead th').forEach(th => {
                headers.push(th.textContent.trim());
            });
            doc.autoTable({
                head: [headers],
                body: Array.from(table.querySelectorAll('tbody tr')).map(row =>
                    Array.from(row.querySelectorAll('td')).map(cell => {
                        if (cell.querySelector('input')) {
                            return cell.querySelector('input').value;
                        } else if (cell.querySelector('span')) {
                            return cell.querySelector('span').textContent;
                        } else {
                            return cell.textContent.trim();
                        }
                    })
                ),
                startY: startY
            });

            const noteS1 = document.getElementById('noteS1').textContent;
            const noteS2 = document.getElementById('noteS2').textContent;
            const ttAnnee = document.getElementById('ttAnnee').textContent;

            let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : startY + 10;
            doc.text(`Moyenne simple: ${noteS1}`, 10, finalY);
            doc.text(`Moyenne pondérée: ${noteS2}`, 10, finalY + 10);
            doc.text(`Total Année: ${ttAnnee}`, 10, finalY + 20);

            doc.save("notes.pdf");
        }

        const pdfBtn = document.createElement('button');
        pdfBtn.textContent = 'Télécharger PDF';
        pdfBtn.style.margin = '10px';
        pdfBtn.addEventListener('click', downloadPDF);
        document.body.appendChild(pdfBtn);