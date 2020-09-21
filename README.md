Willkommen zu Maxs und Fabians lustigen kleinem Geosoftwareabenteuer Have Fun :)

Autoren der Webside : Fabian Fermazin , Maximilian Busch

Diese Webside ermöglicht das Speichern von Busfahrten einzelner User und die Benachrichtigung im Falle einer Ansteckungsgefahr.

Im Git Repository https://github.com/mabu1994/GeosoftProject.git stehen die benötigten Daten zur Verfügung.

Verwendete Frameworks/Bibliotheken: Bootstrap, Chai, Chai-Http, Express, Font Awesome, Here Public Transit API, Jquery, Leaflet, Mocha, MongoDB

Initialisieren: Zum funktionsmäßigen Gebrauch der Webside muss ein HERE-API-Key verwendet werden. Auf https://developer.here.com lässt sich ein kostenloser Key erstellen. Dazu muss in der config.js im Hauptverzeichnis euer HERE-API-Key eingefügt werden. Die Installation des Servers läuft über den Aufruf von npm install im Hauptverzeichnis.

Nutzung: Das Starten des Servers läuft über den Aufruf von npm start
Die Startseite der Webside ist über localhost:3000 zu erreichen. Es stehen Testdatensätze zur Verfügung, Benutzname(User): testuser0, testuser1 Passwort: 123 Benutzername(Arzt): Drosten Passwort: 123 Für die Testuser sind bereits Fahrten gespeichert. Man kann sich entweder mit diesen einloggen oder über den Button "Registrieren" auf die Registratiosnseite gelangen um ein neues Konto zu erstellen. Die Erstellung von zwei Konten mit dem gleichen Nutzernamen ist nicht möglich. Über den Login als User wird man auf die Seite findRoutes (/find) geleitet. Hier können die Routen über Zeiteingabe und Auswahl der Haltestelle auf der Karte gewählt werden. Die Auswahl der Haltestellen wird über den Button "Lokalisieren" vereinfacht, Standort des Users und nahe Haltestellen werden angezeigt. Per Doppelklick auf die Karte kann ein Standort manuell gewählt werden. Über den Button "Speichern" wird die gewählte Fahrt dann vermerkt. Über "Ihre Routen" in der Navigationsleiste gelangt man zur Seite showRoutes (/show). Hier können die gespeicherten Routen und das jeweilige Risiko der Fahrten des eingeloggten Users eingesehen werden.

Über den Login als Arzt wird man auf die Seite medicalSide (/medical) geleitet. Im Textfeld "Nutzer" kann der Nutzername eines Users eingegeben werden und alle seine Fahrten für einen bestimmten Zeitraum als Risikofahrt vermerkt werden. Über die Karte kann das Risiko für einzelne Fahrten geändert werden, ebenso über die Tabelle. Der "Refresh"- Button aktualisiert die vorgenommenen Änderungen. Der "Zurück"-Link in der Navigationsleiste führt immer zur zuletzt aufgerufenen Seite. Datenschutz besteht leider nicht. Passwörter werden unverschlüsselt gespeichert.

Augenmerk: Die folgende Anforderung wurde an die Webside gestellt "Ein Nutzer kann eine aktuelle Abfahrt an einer Haltestelle vor Ort auswählen. Für diese wird dann im Server markiert, dass sie vom Nutzer genommen wurde". In unserer Version ist es dem Nutzer möglich auch vergangene Fahrten zu speichern. Wir begründen dies mit größerer Nutzerfreundlichkeit, so muss der Nutzer nicht jedes mal bevor er in den Bus steigt die Fahrt in der App auswählen.

