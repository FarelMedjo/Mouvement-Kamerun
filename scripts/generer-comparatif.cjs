const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, Header, Footer, VerticalAlign,
} = require('docx')

// Couleurs nationales (cohérentes avec la charte du site)
const KGREEN = '0B6B43'
const KRED = 'CE1126'
const KNAVY = '11203F'
const KGOLD = 'FCD116'
const GREY = '666666'
const LIGHT = 'F4F6F9'
const LINE = 'CCCCCC'

const CONTENT_WIDTH = 9360 // US Letter, marges 1"

// --- Helpers ---------------------------------------------------------------

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] })
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] })
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text, ...opts })],
  })
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'puces', level },
    spacing: { after: 60, line: 264 },
    children: Array.isArray(text) ? text : [new TextRun(text)],
  })
}

function cell(content, { bg, width, bold, color, align } = {}) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: LINE }
  const children = Array.isArray(content)
    ? content
    : [new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [new TextRun({ text: content, bold: !!bold, color: color || '222222' })],
      })]
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: { top: border, bottom: border, left: border, right: border },
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children,
  })
}

// Tableau comparatif 3 colonnes : Critère | Ancien | Nouveau
function compareTable(rows) {
  const w = [3000, 3180, 3180]
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell('Critère', { bg: KNAVY, width: w[0], bold: true, color: 'FFFFFF' }),
      cell('Ancien site (bouhga2025.net)', { bg: KNAVY, width: w[1], bold: true, color: 'FFFFFF' }),
      cell('Nouveau site (Mouvement Kamerun)', { bg: KNAVY, width: w[2], bold: true, color: 'FFFFFF' }),
    ],
  })
  const bodyRows = rows.map((r, i) => {
    const zebra = i % 2 === 1 ? LIGHT : undefined
    return new TableRow({
      children: [
        cell(r[0], { width: w[0], bold: true, bg: zebra }),
        cell(r[1], { width: w[1], bg: zebra }),
        cell(r[2], { width: w[2], bg: zebra }),
      ],
    })
  })
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: w,
    rows: [headerRow, ...bodyRows],
  })
}

// --- Contenu ---------------------------------------------------------------

const children = []

// Titre / couverture
children.push(new Paragraph({
  spacing: { before: 1200, after: 60 },
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: KGREEN, space: 8 } },
  children: [new TextRun({ text: 'MOUVEMENT KAMERUN', bold: true, size: 56, color: KNAVY, font: 'Arial' })],
}))
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 60 },
  children: [new TextRun({ text: 'Nouveau site officiel', bold: true, size: 40, color: KGREEN })],
}))
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 480 },
  children: [new TextRun({ text: 'Ce que le nouveau site apporte par rapport au site actuel', size: 26, color: GREY, italics: true })],
}))
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: 'Document de présentation — première revue client', size: 22, color: '222222' })],
}))
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: '27 juin 2026', size: 22, color: GREY })],
}))

children.push(new Paragraph({ children: [new PageBreak()] }))

// 1. En bref
children.push(h1('1. En bref'))
children.push(p(
  "Le nouveau site n'est pas une simple refonte graphique : c'est une plateforme moderne, " +
  "rapide et sécurisée, conçue pour faire fonctionner le mouvement au quotidien (adhésion, " +
  "bénévoles, scrutateurs, communication) et pas seulement présenter le candidat.",
))
children.push(p("Trois différences majeures :", { bold: true }))
children.push(bullet([
  new TextRun({ text: 'Performance — ', bold: true }),
  new TextRun("technologie récente (React + Vite), pensée pour les connexions à faible débit ; le site se charge vite, même au Cameroun."),
]))
children.push(bullet([
  new TextRun({ text: 'Fonctionnalités — ', bold: true }),
  new TextRun("adhésion en ligne, espaces sécurisés pour les scrutateurs et bénévoles, médiathèque, actualités, événements et back-office d'administration."),
]))
children.push(bullet([
  new TextRun({ text: 'Autonomie — ', bold: true }),
  new TextRun("un espace d'administration permet de mettre à jour le contenu (actualités, programme, vidéos…) sans développeur."),
]))

// 2. Limites du site actuel
children.push(h1('2. Limites du site actuel'))
children.push(p("Le site actuel (bouhga2025.net) reste essentiellement une vitrine. On y observe notamment :"))
children.push(bullet("Chargement lent et technologie vieillissante, peu adaptée aux mobiles et aux connexions lentes."))
children.push(bullet("Aucun espace membre : impossible de gérer en ligne les scrutateurs, les bénévoles ou les adhérents."))
children.push(bullet("Pas d'adhésion en ligne structurée ni de suivi des affiliations."))
children.push(bullet("Mises à jour de contenu dépendantes d'une intervention technique (pas d'espace d'administration)."))
children.push(bullet("Fonctions limitées : pas de back-office, pas de gestion documentaire sécurisée, pas de tableau de bord."))

// 3. Tableau comparatif
children.push(h1('3. Comparatif synthétique'))
children.push(p("Vue d'ensemble des principales différences :"))
children.push(compareTable([
  ['Vitesse de chargement', 'Lent', 'Rapide (technologie récente, optimisée faible débit)'],
  ['Mobile / responsive', 'Limité', 'Conçu mobile + ordinateur'],
  ['Langues', 'Français / Anglais', 'Français / Anglais (bascule instantanée sur tout le site)'],
  ['Adhésion en ligne', 'Non structurée', 'Formulaire d’adhésion dédié + suivi'],
  ['Espace scrutateurs', 'Absent', 'Espace sécurisé : inscription, tableau de bord, dépôt de documents'],
  ['Espace bénévoles', 'Absent', 'Espace dédié : secteurs d’engagement, activation'],
  ['Administration du site', 'Absente', 'Back-office complet (contenus, comptes, affiliations, newsletter)'],
  ['Actualités / Événements', 'Sommaires', 'Articles complets + agenda, gérés depuis l’admin'],
  ['Médiathèque', 'Vidéos éparses', 'Hymne + messages vidéo organisés sur l’accueil'],
  ['Dons', 'Présent', 'Page dédiée (prête à brancher un paiement)'],
  ['Sécurité des données', 'Non documentée', 'Contrôle d’accès côté serveur (RLS), fichiers en stockage privé'],
]))

// 4. Nouvelles fonctionnalités en détail
children.push(new Paragraph({ children: [new PageBreak()] }))
children.push(h1('4. Les nouvelles fonctionnalités en détail'))

children.push(h2('Site public moderne'))
children.push(bullet("Accueil dynamique : carrousel, compteurs animés, présentation claire du mouvement."))
children.push(bullet("Pages : À propos, Le programme, Actualités (avec articles détaillés), Événements, Ressources, Contact."))
children.push(bullet("Bilingue français / anglais sur l'ensemble du site, avec bascule instantanée."))
children.push(bullet("Médiathèque : hymne et messages vidéo (YouTube) organisés directement sur l'accueil."))

children.push(h2('Adhésion et mobilisation'))
children.push(bullet("Adhésion en ligne : formulaire dédié pour rejoindre le mouvement."))
children.push(bullet("Inscription à la newsletter pour informer les sympathisants."))
children.push(bullet("Page « Faire un don » dédiée, prête à recevoir un module de paiement."))

children.push(h2('Espace Scrutateurs (sécurisé)'))
children.push(bullet("Inscription et compte personnel pour chaque scrutateur."))
children.push(bullet("Tableau de bord et dépôt de documents électoraux dans un stockage privé."))
children.push(bullet("Chaque scrutateur ne voit que ses propres documents ; téléchargements par liens temporaires sécurisés."))

children.push(h2('Espace Bénévoles (sécurisé)'))
children.push(bullet("Compte bénévole avec déclaration des secteurs d'engagement."))
children.push(bullet("Possibilité d'activer un rôle de scrutateur selon le secteur déclaré."))

children.push(h2("Espace d'administration (back-office)"))
children.push(p("Réservé à l'équipe, il permet de gérer le site sans intervention technique :"))
children.push(bullet("Publier et modifier les actualités, le programme et les messages vidéo."))
children.push(bullet("Recevoir et consulter les documents déposés par les scrutateurs."))
children.push(bullet("Gérer les comptes, les affiliations et les inscriptions à la newsletter."))

// 5. Performance & sécurité
children.push(h1('5. Performance et sécurité'))
children.push(h2('Performance'))
children.push(bullet("Construit avec React 18 + Vite : interface fluide et chargement rapide."))
children.push(bullet("Optimisé pour les connexions à faible débit — adapté au contexte camerounais."))
children.push(bullet("Responsive : rendu soigné sur téléphone, tablette et ordinateur."))
children.push(h2('Sécurité'))
children.push(bullet("Contrôle d'accès appliqué côté serveur (RLS PostgreSQL), pas seulement dans l'affichage."))
children.push(bullet("Documents des scrutateurs dans un stockage privé, accessibles uniquement à leur propriétaire et aux administrateurs."))
children.push(bullet("Gestion des rôles stricte : les droits d'administration ne sont jamais attribuables depuis le site public."))

// 6. Prochaines étapes
children.push(h1('6. Prochaines étapes proposées'))
children.push(bullet("Première revue du site par le client à partir du lien fourni."))
children.push(bullet("Remontée des retours (textes, images, contenus à ajuster)."))
children.push(bullet("Branchement du module de paiement pour les dons."))
children.push(bullet("Renseignement des contenus définitifs (actualités, programme, vidéos) via l'espace admin."))
children.push(bullet("Mise en ligne sur le nom de domaine final."))

children.push(new Paragraph({
  spacing: { before: 360 },
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: KGOLD, space: 8 } },
  children: [new TextRun({ text: "En résumé : là où le site actuel se contente de présenter, le nouveau site fait vivre le mouvement — plus rapide, plus complet, plus sûr, et autonome au quotidien.", bold: true, color: KNAVY })],
}))

// --- Document --------------------------------------------------------------

const doc = new Document({
  creator: 'Mouvement Kamerun',
  title: 'Comparatif nouveau site vs ancien site',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial', color: KGREEN },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 25, bold: true, font: 'Arial', color: KNAVY },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'puces',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 260 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 260 } } } },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } },
          children: [
            new TextRun({ text: 'Mouvement Kamerun  •  ', size: 16, color: GREY }),
            new TextRun({ text: 'Page ', size: 16, color: GREY }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY }),
            new TextRun({ text: ' / ', size: 16, color: GREY }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GREY }),
          ],
        })],
      }),
    },
    children,
  }],
})

const out = path.join(__dirname, '..', 'Comparatif-Nouveau-Site-Mouvement-Kamerun.docx')
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf)
  console.log('Document écrit :', out)
})
