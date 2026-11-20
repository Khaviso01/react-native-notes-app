import { useState, useMemo, useRef, ComponentRef } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, Alert, Modal, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Text from '../../components/AppText';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';
import { C, CATEGORIES, FONT } from '../../theme';
import { Note } from '../../types';

const fmt = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// Below this screen width the "Filter" word is hidden and only the icon is shown
const HIDE_LABEL_BELOW = 360;

// The sort choices shown inside the filter sheet
const SORT_OPTIONS = [
    { label: 'Newest first', newestFirst: true, icon: 'arrow-down' as const },
    { label: 'Oldest first', newestFirst: false, icon: 'arrow-up' as const },
];

export default function Home() {
    const { user } = useAuth();
    const { notes, deleteNote } = useNotes();
    const router = useRouter();
    const { width } = useWindowDimensions(); // current screen width, updates when the window resizes
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [newestFirst, setNewestFirst] = useState(true); // sort direction
    const [filterOpen, setFilterOpen] = useState(false);

    // Remember where the Filter button is on screen so the dropdown can sit right under it
    const filterBtnRef = useRef<ComponentRef<typeof View>>(null);
    const [anchor, setAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const openFilter = () => {
        filterBtnRef.current?.measureInWindow((x, y, w, h) => {
            setAnchor({ x, y, w, h });
            setFilterOpen(true);
        });
    };

    // Filter by category + search, then sort by date added.
    const visible = useMemo(() => {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        return notes
            .filter((n) => category === 'All' || n.category === category)
            // SEARCH: every typed word must appear somewhere in the title or text.
            .filter((n) => words.every((w) => `${n.title} ${n.text}`.toLowerCase().includes(w)))
            .sort((a, b) => (newestFirst ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    }, [notes, query, category, newestFirst]);

    // Long-press a card to delete it (with confirmation).
    const confirmDelete = (n: Note) =>
        Alert.alert('Delete note?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteNote(n.id) },
        ]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 }}>
            <Text style={{ color: C.text, fontSize: 26, fontWeight: '700', marginTop: 10 }}>
                Good day,{'\n'}{user?.username}!
            </Text>

            {/* Search bar. The input shrinks (flex: 1, minWidth: 0) so the Filter button always fits. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 14, marginVertical: 16 }}>
                <Ionicons name="search" size={18} color={C.text} />
                <TextInput value={query} onChangeText={setQuery} placeholder="Search" placeholderTextColor={C.muted}
                    style={{ flex: 1, minWidth: 0, color: C.text, padding: 14, fontFamily: FONT.regular }} />
                {/* Filter button: icon + "Filter" (the word is hidden on very narrow screens) */}
                <View ref={filterBtnRef} collapsable={false} style={{ flexShrink: 0, marginLeft: 8 }}>
                    <TouchableOpacity
                        onPress={openFilter}
                        accessibilityLabel="Filter notes"
                        hitSlop={8}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Ionicons name="filter" size={18} color={C.accent} />
                        {width >= HIDE_LABEL_BELOW && <Text style={{ color: C.accent, marginLeft: 6 }}>Filter</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Category tabs: All + each category */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                {['All', ...CATEGORIES].map((c) => (
                    <TouchableOpacity key={c} onPress={() => setCategory(c)} style={{ marginRight: 22 }}>
                        <Text style={{ color: C.text, fontSize: 18, opacity: category === c ? 1 : 0.7 }}>{c === 'All' ? 'All Notes' : c}</Text>
                        {category === c && <View style={{ height: 3, backgroundColor: C.accent, marginTop: 4 }} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notes grid: two columns of coloured cards */}
            <FlatList
                data={visible}
                numColumns={2}
                keyExtractor={(n) => n.id}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>No notes yet. Tap + to add one.</Text>}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/note', params: { id: item.id } })}
                        onLongPress={() => confirmDelete(item)}
                        style={{ flex: 1, minHeight: 170, borderRadius: 18, padding: 14, backgroundColor: C.cards[index % C.cards.length], justifyContent: 'space-between' }}
                    >
                        <View>
                            {!!item.title && <Text style={{ fontWeight: '700', marginBottom: 4 }}>{item.title}</Text>}
                            <Text numberOfLines={4}>{item.text}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: '#555' }}>{item.category}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>
                                {fmt(item.createdAt)}{item.editedAt ? ` · edited ${fmt(item.editedAt)}` : ''}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* Filter dropdown: sits right under the Filter button, tap outside to close */}
            <Modal visible={filterOpen} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setFilterOpen(false)}>
                {/* Invisible full-screen layer that closes the dropdown when tapped */}
                <Pressable onPress={() => setFilterOpen(false)} style={{ flex: 1 }}>
                    <Pressable
                        onPress={() => { }} // taps inside the dropdown should not close it
                        style={{
                            position: 'absolute',
                            top: anchor.y + anchor.h + 8,                         // just below the button
                            right: Math.max(12, width - (anchor.x + anchor.w)),   // right edges line up
                            width: Math.min(210, width - 24),                     // never wider than the screen
                            backgroundColor: C.surface,
                            borderRadius: 14,
                            padding: 6,
                            borderWidth: 1,
                            borderColor: '#3A3B3A',
                            elevation: 8,                                         // shadow on Android
                            shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, // shadow on iOS
                        }}
                    >
                        <Text style={{ color: C.muted, fontSize: 12, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 4 }}>Sort by date added</Text>
                        {SORT_OPTIONS.map((o) => (
                            <TouchableOpacity
                                key={o.label}
                                onPress={() => { setNewestFirst(o.newestFirst); setFilterOpen(false); }}
                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10 }}
                            >
                                <Ionicons name={o.icon} size={16} color={newestFirst === o.newestFirst ? C.accent : C.muted} />
                                <Text style={{ color: C.text, marginLeft: 10, flex: 1 }}>{o.label}</Text>
                                {newestFirst === o.newestFirst && <Ionicons name="checkmark" size={18} color={C.accent} />}
                            </TouchableOpacity>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}