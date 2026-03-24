import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.static(__dirname));


const supabaseUrl = 'https://oyjuenioidyokwdguhgy.supabase.co';
const supabaseKey = 'sb_publishable_QFtAJo2r8Tb9MB-UCtVv6Q_4TvoSUjg';

export const supabase = createClient(supabaseUrl, supabaseKey);


app.post('/signup', async (req,res) => {
    const { emailSubmit, passwordSubmit } = req.body; 

    try {

        const saltRounds = 10;
        const hashedPasswrd = await bcrypt.hash(passwordSubmit, saltRounds)

        const { data, error } = await supabase.from('users').insert([{
            email: emailSubmit,
            passwrd: hashedPasswrd,

        }]).select();

        if (error) {
            res.status(500).json({ error: error.message})
            return;
        }

        res.json(data);
        console.log('data sent successfully');


    } catch(err) {
        console.error(err)
        res.status(500).json({error: err.message});

    }
})

app.post('/login', async (req,res) => {

    const { email, passwrd } = req.body

    try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        
        if(error || !data) {
            return res.status(401).json({error: 'Usuário não encontrado'});
        }

        const math = await bcrypt.compare(passwrd, data.passwrd)

        if (!math) {
            return res.status(401).json({error: 'Senha incorreta'});
        }

        res.json({success: true});

    } catch(err){
        console.error(err);
        res.status(500).json({error: err.message})
    }

});

//app.get('/connection', async (req,res) => {
//    
//    try {
//        
//        const { data, error} = await supabase.from('users').select('*');
//        
//        if(error) {
//            console.log('Supabase error:', (error));
//            return res.status(500).json({connected: false, error: error.message});
//        }
//        res.json({connected: true, data})
//        
//    } catch(err) {
//        console.log('Supabase error:', (err));
//        return res.status(500).json({connected: false, error: err.message});
//    }
//});

app.listen(PORT, () => console.log(`server running in http://localhost:${PORT}`));