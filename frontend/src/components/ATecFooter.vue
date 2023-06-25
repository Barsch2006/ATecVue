<script lang="ts">
export default {

}
</script>

<template>
    <footer>
        <div class="linklists">
            <div class="legals linklist">
                <img src="/policy.svg" alt="Piktogramm Schutzschild mit Lupe">
                <a href="/impressum">Impressum</a>
                <a href="/datenschutz">Datenschutz</a>
            </div>

            <div class="links linklist">
                <img class="logo" src="/Atec_small.jpg" alt="ATec Logo">
                <a href="/home">User Zugang</a>
                <a href="/rules">Aula-Regeln</a>
            </div>

            <div class="admin linklist">
                <img src="/admin.svg" alt="Piktogramm Admin-Bereich">
                <a href="/">Login</a>
            </div>
        </div>

        <div class="copyright">
            &copy; &nbsp;
            <a href="https://github.com/filip326">Filip Lukas Paidar</a>, 
            &nbsp;
            <a href="https://github.com/Barsch2006/">Christian Fuchte</a>
            &nbsp; 2023
        </div>
        Alle Rechte vorbehalten
    </footer>
</template>

<style scoped>
footer {
    background-color: #252525;
    margin: 0;
    margin-top: auto;
    bottom: 0px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

a {
    color: #fff;
}

.linklists {
    display: flex;
    gap: 20px;
    margin: 20px;
}

.linklist img {
    max-width: 40px;
    margin-bottom: 20px;
}

.linklist {
    display: flex;
    flex-direction: column;
}

.legals {
    margin-left: auto;
}

.legals * {
    margin-right: 0;
    margin-left: auto;
}

.admin {
    margin-right: auto;
}

.admin * {
    margin-left: 0;
    margin-right: auto;
}

.links {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

footer .copyright {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
}

footer .copyright a {
    text-decoration: none;
}
</style>
