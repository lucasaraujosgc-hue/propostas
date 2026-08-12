const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/applet/database.sqlite');
db.serialize(() => {
    db.get('SELECT config_data FROM app_state WHERE id = ?', ['main_config'], (err, row) => {
        if (row && row.config_data) {
            const data = JSON.parse(row.config_data);
            data.introTemplate = 'Apresentamos nossa proposta técnica para o plano **{{PLANO}}**.\n\nNa **{{EMPRESA}}**, garantimos conformidade legal absoluta e agilidade estratégica para impulsionar seu negócio.\n\nNesses valores já estão inclusos as taxas (da JUCEB) de constituição da empresa.\n\nAs taxas da Junta Comercial já estão inclusas no valor da abertura do CNPJ.';
            db.run('UPDATE app_state SET config_data = ? WHERE id = ?', [JSON.stringify(data), 'main_config'], () => console.log('Updated!'));
        }
    });
});
